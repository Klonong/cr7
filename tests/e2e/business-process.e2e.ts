import assert from "node:assert/strict";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../lib/server/password";
import { deleteR2ObjectByUrl, isR2Configured } from "../../lib/server/r2-storage";

// Load .env into process.env if not already populated (Node 20.12+ / 22+)
async function loadEnvFileIfPresent() {
  const envPath = path.resolve(process.cwd(), ".env");
  try {
    const content = await fs.readFile(envPath, "utf8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = val;
      }
    }
  } catch {
    // .env optional if variables come from shell/CI
  }
}

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  durationMs: number;
  error?: string;
}

const results: TestResult[] = [];

async function runCase(
  suite: string,
  name: string,
  fn: () => Promise<void>
): Promise<void> {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    results.push({ suite, name, passed: true, durationMs });
    console.log(`  PASS [${suite}] ${name} (${durationMs}ms)`);
  } catch (err) {
    const durationMs = Date.now() - start;
    const message =
      err instanceof Error ? `${err.message}` : String(err);
    results.push({ suite, name, passed: false, durationMs, error: message });
    console.error(`  FAIL [${suite}] ${name} (${durationMs}ms)\n       -> ${message}`);
  }
}

function extractCookie(response: Response, cookieName: string): string | null {
  const setCookies = response.headers.getSetCookie?.() ?? [];
  for (const header of setCookies) {
    const firstPart = header.split(";")[0]?.trim() ?? "";
    if (firstPart.startsWith(`${cookieName}=`)) {
      return firstPart;
    }
  }
  const fallback = response.headers.get("set-cookie");
  if (fallback) {
    const match = fallback.match(new RegExp(`${cookieName}=[^;]+`));
    if (match) return match[0];
  }
  return null;
}

async function isServerReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(`${url}/api/products`, {
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function waitForServerReady(
  baseUrl: string,
  getLogs: () => string,
  timeoutMs = 45_000
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastError = "Server not yet responding";
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${baseUrl}/api/products`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) return;
      lastError = `HTTP ${res.status}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
    // Condition polling interval (250ms) until readiness signal succeeds
    await new Promise((r) => setTimeout(r, 250));
  }
  const logsTail = getLogs().slice(-1500);
  throw new Error(
    `Server failed readiness check at ${baseUrl} within ${timeoutMs}ms (${lastError})${
      logsTail ? `\n--- Server logs ---\n${logsTail}` : ""
    }`
  );
}

function stopChildServer(child: ChildProcess | null) {
  if (!child || !child.pid) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
    });
  } else {
    child.kill("SIGTERM");
  }
}

async function main() {
  await loadEnvFileIfPresent();

  const runId = `e2e${Date.now().toString(36)}`;
  const port = Number(process.env.E2E_PORT || "3199");
  let baseUrl = process.env.E2E_BASE_URL?.replace(/\/+$/, "") || "";
  let managedServer = false;

  if (!baseUrl) {
    if (await isServerReachable("http://127.0.0.1:3000")) {
      baseUrl = "http://127.0.0.1:3000";
      console.log(`Detected running dev server at ${baseUrl}; running isolated E2E against it.`);
    } else {
      baseUrl = `http://127.0.0.1:${port}`;
      managedServer = true;
    }
  }

  const prisma = new PrismaClient();
  let serverChild: ChildProcess | null = null;
  let serverLogs = "";

  // Track all created resources so cleanup is 100% deterministic
  const createdAdminIds: string[] = [];
  const createdProductIds: string[] = [];
  const createdCategorySlugs: string[] = [];
  const createdMotorcycleIds: string[] = [];
  const createdHighlightIds: string[] = [];
  const uploadedUrls: string[] = [];
  let originalHomeSettings: {
    hero: unknown;
    sections: unknown;
    trustPillars: unknown;
  } | null = null;

  // Ephemeral isolated Super Admin owned strictly by this test run
  const superUsername = `super_${runId}`.slice(0, 32);
  const superPassword = `SuperPass!${runId}99`;
  const staffUsername = `staff_${runId}`.slice(0, 32);
  const staffPassword = `StaffPass!${runId}88`;
  const staffNewPassword = `StaffNew!${runId}77`;

  try {
    console.log(`\n=== CR7 Racing E2E Business Process Test Suite (${runId}) ===`);

    // Seed isolated ephemeral Super Admin in PostgreSQL (never touches user's real admin!)
    const superHash = await hashPassword(superPassword);
    const superRow = await prisma.adminUser.create({
      data: {
        username: superUsername,
        passwordHash: superHash,
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });
    createdAdminIds.push(superRow.id);

    // Snapshot HomeSettings before any test mutates it
    const homeRow = await prisma.homeSettings.findUnique({
      where: { id: "default" },
    });
    if (homeRow) {
      originalHomeSettings = {
        hero: homeRow.hero,
        sections: homeRow.sections,
        trustPillars: homeRow.trustPillars,
      };
    }

    if (managedServer) {
      console.log(`Starting isolated Next.js server on ${baseUrl}...`);
      const nextBin = path.resolve(
        process.cwd(),
        "node_modules",
        "next",
        "dist",
        "bin",
        "next"
      );
      serverChild = spawn(
        process.execPath,
        [nextBin, "dev", "-p", String(port), "-H", "127.0.0.1"],
        {
          cwd: process.cwd(),
          env: {
            ...process.env,
            NEXT_TELEMETRY_DISABLED: "1",
          },
          stdio: ["ignore", "pipe", "pipe"],
        }
      );
      serverChild.stdout?.on("data", (d) => {
        serverLogs += String(d);
      });
      serverChild.stderr?.on("data", (d) => {
        serverLogs += String(d);
      });

      await waitForServerReady(baseUrl, () => serverLogs, 60_000);
      console.log(`Server ready at ${baseUrl}\n`);
    }

    const api = async (
      reqPath: string,
      options: {
        method?: string;
        cookie?: string | null;
        origin?: string | null;
        json?: unknown;
        formData?: FormData;
      } = {}
    ) => {
      const headers = new Headers();
      if (options.cookie) headers.set("Cookie", options.cookie);
      if (options.origin !== undefined && options.origin !== null) {
        headers.set("Origin", options.origin);
      } else if (
        options.method &&
        ["POST", "PUT", "PATCH", "DELETE"].includes(options.method.toUpperCase())
      ) {
        headers.set("Origin", baseUrl);
      }
      if (options.json !== undefined) {
        headers.set("Content-Type", "application/json");
      }

      return fetch(`${baseUrl}${reqPath}`, {
        method: options.method ?? "GET",
        headers,
        body:
          options.formData ??
          (options.json !== undefined ? JSON.stringify(options.json) : undefined),
        redirect: "manual",
      });
    };

    let superCookie = "";
    let staffId = "";
    let staffCookie = "";
    let testCategorySlug = "";
    let testMotorcycleId = "";
    let testMotorcycleName = "";
    let uploadedWebp1 = "";
    let uploadedWebp2 = "";
    let testProductId = "";
    let testProductSlug = "";
    let testHighlightId = "";

    // =========================================================================
    // SUITE 1: AUTHENTICATION, JWT, RATE LIMITING & CSRF
    // =========================================================================
    await runCase("Auth", "Blocks unauthenticated access to protected admin endpoints", async () => {
      const checks = await Promise.all([
        api("/api/admin/me"),
        api("/api/admin/products"),
        api("/api/admin/users"),
        api("/api/admin/home"),
      ]);
      for (const res of checks) {
        assert.equal(res.status, 401, `Expected 401, got ${res.status}`);
      }
    });

    await runCase("Auth", "Rejects wrong password and enforces rate limit after 5 attempts", async () => {
      const rateUser = `ratetest_${runId}`;
      for (let i = 1; i <= 5; i++) {
        const res = await api("/api/admin/login", {
          method: "POST",
          json: { username: rateUser, password: "wrong-password-123" },
        });
        assert.equal(res.status, 401, `Attempt ${i} should return 401`);
      }
      const blocked = await api("/api/admin/login", {
        method: "POST",
        json: { username: rateUser, password: "wrong-password-123" },
      });
      assert.equal(blocked.status, 429, "6th failed login must trigger 429 rate limit");
      assert.ok(blocked.headers.get("retry-after"), "429 must include Retry-After header");
    });

    await runCase("Auth", "Logs in SUPER_ADMIN from PostgreSQL and sets HttpOnly SameSite=Strict JWT cookie", async () => {
      const res = await api("/api/admin/login", {
        method: "POST",
        json: { username: superUsername, password: superPassword },
      });
      assert.equal(res.status, 200);
      const data = (await res.json()) as {
        ok: boolean;
        username: string;
        role: string;
      };
      assert.equal(data.ok, true);
      assert.equal(data.username, superUsername);
      assert.equal(data.role, "SUPER_ADMIN");

      const setCookieRaw = res.headers.get("set-cookie") ?? "";
      assert.match(setCookieRaw.toLowerCase(), /httponly/);
      assert.match(setCookieRaw.toLowerCase(), /samesite=strict/);

      const cookie = extractCookie(res, "cr7_admin_token");
      assert.ok(cookie, "Login must set cr7_admin_token cookie");
      superCookie = cookie;

      const meRes = await api("/api/admin/me", { cookie: superCookie });
      assert.equal(meRes.status, 200);
      const meData = (await meRes.json()) as {
        authenticated: boolean;
        session: { username: string; role: string };
      };
      assert.equal(meData.authenticated, true);
      assert.equal(meData.session.username, superUsername);
      assert.equal(meData.session.role, "SUPER_ADMIN");
    });

    await runCase("Security", "Blocks cross-origin CSRF mutation with 403", async () => {
      const res = await api("/api/admin/categories", {
        method: "POST",
        cookie: superCookie,
        origin: "https://attacker.invalid",
        json: {
          name: "CSRF Attempt",
          shortName: "CSRF",
          description: "Should never succeed",
        },
      });
      assert.equal(res.status, 403);
    });

    await runCase("Auth", "Revokes JWT server-side via tokenVersion on logout", async () => {
      const oldCookie = superCookie;
      const logoutRes = await api("/api/admin/logout", {
        method: "POST",
        cookie: oldCookie,
      });
      assert.equal(logoutRes.status, 200);

      // Replaying old JWT cookie must now be rejected with 401
      const replayRes = await api("/api/admin/me", { cookie: oldCookie });
      assert.equal(replayRes.status, 401, "Old JWT must fail after logout revocation");

      // Re-login to get fresh session for remaining tests
      const reLogin = await api("/api/admin/login", {
        method: "POST",
        json: { username: superUsername, password: superPassword },
      });
      assert.equal(reLogin.status, 200);
      superCookie = extractCookie(reLogin, "cr7_admin_token") ?? "";
      assert.ok(superCookie);
    });

    // =========================================================================
    // SUITE 2: DATABASE ADMIN ACCOUNTS & RBAC
    // =========================================================================
    await runCase("AdminUsers", "SUPER_ADMIN creates ADMIN user in DB without exposing passwordHash", async () => {
      const res = await api("/api/admin/users", {
        method: "POST",
        cookie: superCookie,
        json: {
          username: staffUsername,
          password: staffPassword,
          role: "ADMIN",
        },
      });
      assert.equal(res.status, 201);
      const body = (await res.json()) as {
        user: Record<string, unknown>;
      };
      assert.equal(body.user.username, staffUsername);
      assert.equal(body.user.role, "ADMIN");
      assert.equal(body.user.isActive, true);
      assert.equal("passwordHash" in body.user, false, "passwordHash must never be returned");
      staffId = String(body.user.id);
      createdAdminIds.push(staffId);

      // Duplicate username rejected with 409
      const dup = await api("/api/admin/users", {
        method: "POST",
        cookie: superCookie,
        json: {
          username: staffUsername,
          password: staffPassword,
          role: "ADMIN",
        },
      });
      assert.equal(dup.status, 409);
    });

    await runCase("AdminUsers", "Regular ADMIN enforces RBAC and can change own password with JWT rotation", async () => {
      const loginRes = await api("/api/admin/login", {
        method: "POST",
        json: { username: staffUsername, password: staffPassword },
      });
      assert.equal(loginRes.status, 200);
      const originalStaffCookie = extractCookie(loginRes, "cr7_admin_token") ?? "";
      assert.ok(originalStaffCookie);

      // Regular ADMIN cannot create another admin (403)
      const forbiddenCreate = await api("/api/admin/users", {
        method: "POST",
        cookie: originalStaffCookie,
        json: {
          username: `blocked_${runId}`,
          password: "Password1234",
          role: "ADMIN",
        },
      });
      assert.equal(forbiddenCreate.status, 403);

      // Regular ADMIN cannot modify SUPER_ADMIN (403)
      const forbiddenPatch = await api(`/api/admin/users/${superRow.id}`, {
        method: "PATCH",
        cookie: originalStaffCookie,
        json: { isActive: false },
      });
      assert.equal(forbiddenPatch.status, 403);

      // Regular ADMIN changes own password -> rotates JWT & invalidates old JWT
      const changePass = await api(`/api/admin/users/${staffId}`, {
        method: "PATCH",
        cookie: originalStaffCookie,
        json: { password: staffNewPassword },
      });
      assert.equal(changePass.status, 200);
      staffCookie = extractCookie(changePass, "cr7_admin_token") ?? "";
      assert.ok(staffCookie, "Self password change should issue fresh JWT cookie");

      const oldReplay = await api("/api/admin/me", { cookie: originalStaffCookie });
      assert.equal(oldReplay.status, 401, "Old staff JWT must be revoked on password change");

      const newSessionCheck = await api("/api/admin/me", { cookie: staffCookie });
      assert.equal(newSessionCheck.status, 200, "Refreshed staff JWT must stay valid");
    });

    await runCase("AdminUsers", "SUPER_ADMIN cannot self-deactivate/self-delete, can deactivate & delete other admin", async () => {
      const selfDeactivate = await api(`/api/admin/users/${superRow.id}`, {
        method: "PATCH",
        cookie: superCookie,
        json: { isActive: false },
      });
      assert.equal(selfDeactivate.status, 400);

      const selfDelete = await api(`/api/admin/users/${superRow.id}`, {
        method: "DELETE",
        cookie: superCookie,
      });
      assert.equal(selfDelete.status, 400);

      // Deactivate staff -> immediately revokes staff JWT & blocks login
      const deactivate = await api(`/api/admin/users/${staffId}`, {
        method: "PATCH",
        cookie: superCookie,
        json: { isActive: false },
      });
      assert.equal(deactivate.status, 200);

      const revokedCheck = await api("/api/admin/me", { cookie: staffCookie });
      assert.equal(revokedCheck.status, 401);

      const blockedLogin = await api("/api/admin/login", {
        method: "POST",
        json: { username: staffUsername, password: staffNewPassword },
      });
      assert.equal(blockedLogin.status, 401);

      // Delete staff admin
      const delRes = await api(`/api/admin/users/${staffId}`, {
        method: "DELETE",
        cookie: superCookie,
      });
      assert.equal(delRes.status, 200);
    });

    // =========================================================================
    // SUITE 3: CATEGORIES & MOTORCYCLES CRUD
    // =========================================================================
    await runCase("Categories", "Creates, reads publicly, updates, and rejects duplicate category", async () => {
      const slug = `e2e-cat-${runId}`;
      const createRes = await api("/api/admin/categories", {
        method: "POST",
        cookie: superCookie,
        json: {
          slug,
          name: `Kategori Uji ${runId}`,
          shortName: "Uji E2E",
          description: "Kategori sementara untuk pengujian E2E otomatis.",
        },
      });
      assert.equal(createRes.status, 201);
      const created = (await createRes.json()) as { category: { slug: string } };
      testCategorySlug = created.category.slug;
      createdCategorySlugs.push(testCategorySlug);

      // Duplicate slug -> 409
      const dup = await api("/api/admin/categories", {
        method: "POST",
        cookie: superCookie,
        json: {
          slug: testCategorySlug,
          name: "Duplikat",
          shortName: "Dup",
          description: "Harus ditolak karena duplikat.",
        },
      });
      assert.equal(dup.status, 409);

      // Update category
      const updateRes = await api(`/api/admin/categories/${testCategorySlug}`, {
        method: "PUT",
        cookie: superCookie,
        json: {
          name: `Kategori Uji Updated ${runId}`,
          shortName: "Uji Updated",
          description: "Deskripsi diperbarui oleh E2E.",
        },
      });
      assert.equal(updateRes.status, 200);

      // Public API lists updated category
      const pubRes = await api("/api/categories");
      assert.equal(pubRes.status, 200);
      const pubData = (await pubRes.json()) as {
        categories: Array<{ slug: string; shortName: string }>;
      };
      const found = pubData.categories.find((c) => c.slug === testCategorySlug);
      assert.ok(found, "Created category must appear on public GET /api/categories");
      assert.equal(found.shortName, "Uji Updated");
    });

    await runCase("Motorcycles", "Creates, reads publicly, and rejects duplicate motorcycle", async () => {
      const model = `TestBike-${runId.slice(-5)}`;
      const createRes = await api("/api/admin/motorcycles", {
        method: "POST",
        cookie: superCookie,
        json: {
          brand: "Yamaha",
          model,
          type: "Matic",
        },
      });
      assert.equal(createRes.status, 201);
      const created = (await createRes.json()) as {
        motorcycle: { id: string; name: string };
      };
      testMotorcycleId = created.motorcycle.id;
      testMotorcycleName = created.motorcycle.name;
      createdMotorcycleIds.push(testMotorcycleId);

      // Duplicate -> 409
      const dup = await api("/api/admin/motorcycles", {
        method: "POST",
        cookie: superCookie,
        json: {
          brand: "Yamaha",
          model,
          type: "Matic",
        },
      });
      assert.equal(dup.status, 409);

      // Public API lists motorcycle
      const pubRes = await api("/api/motorcycles");
      assert.equal(pubRes.status, 200);
      const pubData = (await pubRes.json()) as {
        motorcycles: Array<{ id: string }>;
      };
      assert.ok(
        pubData.motorcycles.some((m) => m.id === testMotorcycleId),
        "Created motorcycle must appear on public GET /api/motorcycles"
      );
    });

    // =========================================================================
    // SUITE 4: IMAGE UPLOAD SECURITY & AUTO-WEBP CONVERSION
    // =========================================================================
    await runCase("Upload", "Blocks SVG and spoofed MIME binary uploads with 400", async () => {
      const svgForm = new FormData();
      svgForm.append(
        "file",
        new Blob(['<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'], {
          type: "image/svg+xml",
        }),
        "xss.svg"
      );
      const svgRes = await api("/api/admin/upload", {
        method: "POST",
        cookie: superCookie,
        formData: svgForm,
      });
      assert.equal(svgRes.status, 400, "SVG upload must be blocked");

      const spoofForm = new FormData();
      spoofForm.append(
        "file",
        new Blob(["NOT_A_REAL_PNG_FILE_CONTENTS"], { type: "image/png" }),
        "fake.png"
      );
      const spoofRes = await api("/api/admin/upload", {
        method: "POST",
        cookie: superCookie,
        formData: spoofForm,
      });
      assert.equal(spoofRes.status, 400, "MIME-spoofed payload must be blocked by magic bytes");
    });

    await runCase("Upload", "Converts uploaded PNG & JPEG into real .webp files (R2 or local)", async () => {
      const pngBytes = await sharp({
        create: {
          width: 64,
          height: 64,
          channels: 4,
          background: { r: 202, g: 12, b: 31, alpha: 1 },
        },
      })
        .png()
        .toBuffer();

      const form1 = new FormData();
      form1.append(
        "file",
        new Blob([new Uint8Array(pngBytes)], { type: "image/png" }),
        "foto-utama-test.png"
      );
      form1.append("folder", "products");

      const res1 = await api("/api/admin/upload", {
        method: "POST",
        cookie: superCookie,
        formData: form1,
      });
      assert.equal(res1.status, 201, "Valid PNG upload should succeed");
      const up1 = (await res1.json()) as { url: string; storage?: string };
      assert.ok(up1.url.endsWith(".webp"), `Expected .webp extension, got ${up1.url}`);
      uploadedWebp1 = up1.url;
      uploadedUrls.push(up1.url);

      // Verify saved file is genuine RIFF/WEBP binary if stored locally
      if (up1.storage === "local") {
        const localFile = path.resolve(
          process.cwd(),
          "public",
          up1.url.replace(/^\/+/, "")
        );
        const savedBuf = await fs.readFile(localFile);
        assert.equal(savedBuf.subarray(0, 4).toString("ascii"), "RIFF");
        assert.equal(savedBuf.subarray(8, 12).toString("ascii"), "WEBP");
      }

      // Second image: JPEG -> auto WebP
      const jpgBytes = await sharp({
        create: {
          width: 80,
          height: 60,
          channels: 3,
          background: { r: 15, g: 23, b: 42 },
        },
      })
        .jpeg({ quality: 90 })
        .toBuffer();

      const form2 = new FormData();
      form2.append(
        "file",
        new Blob([new Uint8Array(jpgBytes)], { type: "image/jpeg" }),
        "foto-detail-test.jpg"
      );
      form2.append("folder", "products");

      const res2 = await api("/api/admin/upload", {
        method: "POST",
        cookie: superCookie,
        formData: form2,
      });
      assert.equal(res2.status, 201, "Valid JPEG upload should succeed");
      const up2 = (await res2.json()) as { url: string };
      assert.ok(up2.url.endsWith(".webp"), `Expected .webp extension, got ${up2.url}`);
      uploadedWebp2 = up2.url;
      uploadedUrls.push(up2.url);
    });

    // =========================================================================
    // SUITE 5: MULTI-IMAGE PRODUCT + VARIANTS + REFERENTIAL INTEGRITY
    // =========================================================================
    await runCase("Products", "Rejects untrusted image URLs and non-marketplace links", async () => {
      const badImageRes = await api("/api/admin/products", {
        method: "POST",
        cookie: superCookie,
        json: {
          name: `Bad Img ${runId}`,
          sku: `BAD-${runId.slice(-4)}`,
          category: testCategorySlug,
          price: 150000,
          images: [{ url: "https://evil.example/payload.png", alt: "Bad" }],
          links: {},
        },
      });
      assert.equal(badImageRes.status, 400);

      const badLinkRes = await api("/api/admin/products", {
        method: "POST",
        cookie: superCookie,
        json: {
          name: `Bad Link ${runId}`,
          sku: `BDL-${runId.slice(-4)}`,
          category: testCategorySlug,
          price: 150000,
          images: [{ url: uploadedWebp1, alt: "Good" }],
          links: { shopee: "https://phishing.example/checkout" },
        },
      });
      assert.equal(badLinkRes.status, 400);
    });

    await runCase("Products", "Creates multi-image product with variants, exposes on public API, PDP & sitemap", async () => {
      const createRes = await api("/api/admin/products", {
        method: "POST",
        cookie: superCookie,
        json: {
          name: `CR7 E2E Bi-LED Test ${runId}`,
          sku: `E2E-${runId.slice(-5).toUpperCase()}`,
          category: testCategorySlug,
          price: 350000,
          originalPrice: 420000,
          currency: "IDR",
          images: [
            { url: uploadedWebp1, alt: "Foto Utama E2E", label: "Utama" },
            { url: uploadedWebp2, alt: "Foto Detail E2E", label: "Detail" },
          ],
          variants: [
            {
              name: "Putih 6000K",
              sku: `E2E-W-${runId.slice(-4).toUpperCase()}`,
              price: 350000,
              colorHex: "#E0F2FE",
              inStock: true,
            },
            {
              name: "Kuning 3000K",
              sku: `E2E-Y-${runId.slice(-4).toUpperCase()}`,
              price: 365000,
              colorHex: "#F59E0B",
              inStock: true,
            },
          ],
          shortSpecs: ["60W Real", "IP67"],
          fullSpecs: { Daya: "60W", Tegangan: "DC 12V" },
          inTheBox: ["1x Unit Lampu", "1x Breket"],
          fitmentNotes: "Wajib arus DC 12V.",
          compatibility: ["Universal", testMotorcycleName],
          badges: ["Terlaris", "Waterproof"],
          featured: true,
          inStock: true,
          links: {
            shopee: "https://shopee.co.id/search?keyword=cr7",
            tiktokShop: "https://shop.tiktok.com/",
          },
          description: "Produk pengujian E2E otomatis dengan multi-foto WebP.",
        },
      });
      assert.equal(createRes.status, 201);
      const created = (await createRes.json()) as {
        product: {
          id: string;
          slug: string;
          images: Array<{ url: string }>;
          variants: Array<{ id: string; name: string }>;
        };
      };
      testProductId = created.product.id;
      testProductSlug = created.product.slug;
      createdProductIds.push(testProductId);

      assert.equal(created.product.images.length, 2, "Product must store both WebP images");
      assert.equal(created.product.variants.length, 2, "Product must store both variants");

      // Public catalog API returns it
      const pubProducts = await api("/api/products");
      assert.equal(pubProducts.status, 200);
      const list = (await pubProducts.json()) as {
        products: Array<{ id: string; images: Array<{ url: string }> }>;
      };
      const found = list.products.find((p) => p.id === testProductId);
      assert.ok(found, "New product must appear in public GET /api/products");
      assert.equal(found.images.length, 2);

      // PDP SSR HTML returns 200 with Product, BreadcrumbList & FAQPage JSON-LD
      const pdpRes = await api(`/products/${testProductSlug}`);
      assert.equal(pdpRes.status, 200);
      const html = await pdpRes.text();
      assert.match(html, /application\/ld\+json/);
      assert.match(html, /"@type":"Product"/);
      assert.match(html, /"@type":"FAQPage"/);
      assert.match(html, /"@type":"BreadcrumbList"/);

      // Category in use cannot be deleted (409 referential integrity)
      const blockedCatDelete = await api(
        `/api/admin/categories/${testCategorySlug}`,
        {
          method: "DELETE",
          cookie: superCookie,
        }
      );
      assert.equal(
        blockedCatDelete.status,
        409,
        "Category with assigned product must not be deletable"
      );
    });

    await runCase("Products", "Updates product images/variants, toggles stock, and deletes cleanly", async () => {
      const updateRes = await api(`/api/admin/products/${testProductId}`, {
        method: "PUT",
        cookie: superCookie,
        json: {
          name: `CR7 E2E Bi-LED Updated ${runId}`,
          sku: `E2E-${runId.slice(-5).toUpperCase()}`,
          slug: testProductSlug,
          category: testCategorySlug,
          price: 340000,
          currency: "IDR",
          images: [
            { url: uploadedWebp2, alt: "Promoted Utama", label: "Utama" },
            { url: uploadedWebp1, alt: "Second Photo", label: "Detail" },
            { url: "/images/prod-beam-test.svg", alt: "Beam Test", label: "Pola Cahaya" },
          ],
          variants: [
            {
              name: "Paket Pro + Relay",
              price: 399000,
              colorHex: "#CA0C1F",
              inStock: true,
            },
          ],
          shortSpecs: ["65W Real", "IP67"],
          fullSpecs: { Daya: "65W" },
          inTheBox: ["1x Unit Lampu"],
          fitmentNotes: "Updated note.",
          compatibility: ["Universal"],
          badges: ["Baru"],
          featured: false,
          inStock: true,
          links: { shopee: "https://shopee.co.id/search?keyword=cr7" },
          description: "Deskripsi diperbarui.",
        },
      });
      assert.equal(updateRes.status, 200);
      const updated = (await updateRes.json()) as {
        product: { images: Array<{ url: string }>; variants: Array<{ name: string }> };
      };
      assert.equal(updated.product.images.length, 3);
      assert.equal(updated.product.images[0].url, uploadedWebp2);
      assert.equal(updated.product.variants.length, 1);

      // Quick stock toggle (PATCH)
      const stockRes = await api(`/api/admin/products/${testProductId}`, {
        method: "PATCH",
        cookie: superCookie,
        json: { inStock: false },
      });
      assert.equal(stockRes.status, 200);
      const stockData = (await stockRes.json()) as {
        product: { inStock: boolean };
      };
      assert.equal(stockData.product.inStock, false);

      // Delete product
      const delProd = await api(`/api/admin/products/${testProductId}`, {
        method: "DELETE",
        cookie: superCookie,
      });
      assert.equal(delProd.status, 200);

      // Now deleting the empty test category & test motorcycle must succeed!
      const delCat = await api(`/api/admin/categories/${testCategorySlug}`, {
        method: "DELETE",
        cookie: superCookie,
      });
      assert.equal(delCat.status, 200);

      const delMoto = await api(`/api/admin/motorcycles/${testMotorcycleId}`, {
        method: "DELETE",
        cookie: superCookie,
      });
      assert.equal(delMoto.status, 200);
    });

    // =========================================================================
    // SUITE 6: HOME SETTINGS & SPOTLIGHT HIGHLIGHTS CRUD
    // =========================================================================
    await runCase("Home", "Creates, updates, toggles, and deletes Spotlight Highlight + round-trips HomeSettings", async () => {
      const createHl = await api("/api/admin/home/highlights", {
        method: "POST",
        cookie: superCookie,
        json: {
          badge: "E2E TEST",
          title: `Sorotan Uji ${runId}`,
          description: "Deskripsi sorotan uji otomatis untuk validasi bisnis.",
          bullets: ["Poin 1", "Poin 2"],
          imageUrl: "/images/prod-beam-test.svg",
          imageAlt: "Gambar uji",
          ctaLabel: "Lihat Katalog",
          ctaHref: "/products",
          active: true,
        },
      });
      assert.equal(createHl.status, 201);
      const hlData = (await createHl.json()) as {
        highlight: { id: string; active: boolean };
      };
      testHighlightId = hlData.highlight.id;
      createdHighlightIds.push(testHighlightId);

      const updateHl = await api(
        `/api/admin/home/highlights/${testHighlightId}`,
        {
          method: "PUT",
          cookie: superCookie,
          json: {
            badge: "E2E UPDATED",
            title: `Sorotan Updated ${runId}`,
            description: "Deskripsi sorotan diperbarui untuk pengujian E2E.",
            bullets: ["Poin A"],
            imageUrl: "/images/prod-beam-test.svg",
            imageAlt: "Alt updated",
            ctaLabel: "Cek Produk",
            ctaHref: "/products",
            active: true,
          },
        }
      );
      assert.equal(updateHl.status, 200);

      const toggleHl = await api(
        `/api/admin/home/highlights/${testHighlightId}`,
        {
          method: "PATCH",
          cookie: superCookie,
          json: { active: false },
        }
      );
      assert.equal(toggleHl.status, 200);
      const toggled = (await toggleHl.json()) as {
        highlight: { active: boolean };
      };
      assert.equal(toggled.highlight.active, false);

      const delHl = await api(`/api/admin/home/highlights/${testHighlightId}`, {
        method: "DELETE",
        cookie: superCookie,
      });
      assert.equal(delHl.status, 200);

      // HomeSettings GET + PUT round-trip (non-destructive)
      const getHome = await api("/api/admin/home", { cookie: superCookie });
      assert.equal(getHome.status, 200);
      const homePayload = (await getHome.json()) as {
        content: { hero: unknown; sections: unknown; trustPillars: unknown };
      };
      const putHome = await api("/api/admin/home", {
        method: "PUT",
        cookie: superCookie,
        json: {
          hero: homePayload.content.hero,
          sections: homePayload.content.sections,
          trustPillars: homePayload.content.trustPillars,
        },
      });
      assert.equal(putHome.status, 200);
    });

    // =========================================================================
    // SUITE 7: TECHNICAL SEO & SECURITY HEADERS
    // =========================================================================
    await runCase("SEO & Security", "Verifies robots.txt, sitemap.xml, manifest, OG image, and security headers", async () => {
      const robotsRes = await api("/robots.txt");
      assert.equal(robotsRes.status, 200);
      const robotsTxt = await robotsRes.text();
      assert.match(robotsTxt, /Sitemap:/i);
      assert.match(robotsTxt, /Disallow:\s*\/api\//i);
      assert.doesNotMatch(robotsTxt, /\/admin/i, "robots.txt must not reveal hidden /admin path");

      const sitemapRes = await api("/sitemap.xml");
      assert.equal(sitemapRes.status, 200);
      const sitemapXml = await sitemapRes.text();
      assert.match(sitemapXml, /<urlset/i);
      assert.match(sitemapXml, /\/products<\/loc>/i);
      assert.match(sitemapXml, /\/about<\/loc>/i);

      const manifestRes = await api("/manifest.webmanifest");
      assert.equal(manifestRes.status, 200);
      const manifest = (await manifestRes.json()) as { theme_color: string };
      assert.equal(manifest.theme_color, "#ca0c1f");

      const ogRes = await api("/opengraph-image");
      assert.equal(ogRes.status, 200);
      assert.match(ogRes.headers.get("content-type") ?? "", /image\/png/i);

      const apiHeadersRes = await api("/api/products");
      assert.equal(apiHeadersRes.headers.get("x-frame-options"), "DENY");
      assert.equal(apiHeadersRes.headers.get("x-content-type-options"), "nosniff");
      assert.match(apiHeadersRes.headers.get("x-robots-tag") ?? "", /noindex/i);

      const adminLoginRes = await api("/admin/login");
      assert.equal(adminLoginRes.status, 200);
      assert.match(adminLoginRes.headers.get("x-robots-tag") ?? "", /noindex/i);
    });
  } finally {
    // Guaranteed cleanup of ALL ephemeral test data + uploaded files + child process
    stopChildServer(serverChild);

    for (const id of createdProductIds) {
      await prisma.product.deleteMany({ where: { id } }).catch(() => {});
    }
    for (const slug of createdCategorySlugs) {
      await prisma.category.deleteMany({ where: { slug } }).catch(() => {});
    }
    for (const id of createdMotorcycleIds) {
      await prisma.motorcycle.deleteMany({ where: { id } }).catch(() => {});
    }
    for (const id of createdHighlightIds) {
      await prisma.homeHighlight.deleteMany({ where: { id } }).catch(() => {});
    }
    for (const id of createdAdminIds) {
      await prisma.adminUser.deleteMany({ where: { id } }).catch(() => {});
    }
    if (originalHomeSettings) {
      await prisma.homeSettings
        .update({
          where: { id: "default" },
          data: {
            hero: originalHomeSettings.hero as never,
            sections: originalHomeSettings.sections as never,
            trustPillars: originalHomeSettings.trustPillars as never,
          },
        })
        .catch(() => {});
    }
    for (const url of uploadedUrls) {
      if (url.startsWith("/uploads/")) {
        const localFile = path.resolve(
          process.cwd(),
          "public",
          url.replace(/^\/+/, "")
        );
        await fs.unlink(localFile).catch(() => {});
      } else if (isR2Configured()) {
        await deleteR2ObjectByUrl(url).catch(() => {});
      }
    }

    await prisma.$disconnect();
  }

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  const totalMs = results.reduce((sum, r) => sum + r.durationMs, 0);

  console.log(`\n=============================================================`);
  console.log(`E2E SUMMARY: ${passed}/${total} passed, ${failed} failed (${totalMs}ms)`);
  console.log(`=============================================================\n`);

  if (failed > 0) {
    if (serverLogs) {
      console.error("--- Server stderr/stdout tail ---\n" + serverLogs.slice(-1500));
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("E2E Runner fatal error:", err);
  process.exit(1);
});
