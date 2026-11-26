import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { logSecurityEvent } from "@/lib/server/audit-log";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limit";
import { slugify } from "@/lib/format";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const UPLOAD_RATE_LIMIT = 30;
const UPLOAD_RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const ALLOWED_MIME_TO_EXT: Record<string, ".jpg" | ".png" | ".webp"> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

/**
 * Inspects leading binary magic bytes to prevent MIME spoofing and SVG/script uploads.
 */
function detectRasterImageExt(buf: Buffer): ".jpg" | ".png" | ".webp" | null {
  if (
    buf.length >= 3 &&
    buf[0] === 0xff &&
    buf[1] === 0xd8 &&
    buf[2] === 0xff
  ) {
    return ".jpg";
  }
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return ".png";
  }
  if (
    buf.length >= 12 &&
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return ".webp";
  }
  return null;
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession({ request });
  if (auth.response) return auth.response;

  const ip = getClientIp(request);
  const rate = checkRateLimit(
    `upload:${auth.session.userId}:${ip}`,
    UPLOAD_RATE_LIMIT,
    UPLOAD_RATE_WINDOW_MS
  );
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak unggahan gambar. Coba lagi beberapa menit lagi." },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File gambar tidak ditemukan." },
        { status: 400 }
      );
    }

    const declaredExt = ALLOWED_MIME_TO_EXT[file.type];
    if (!declaredExt) {
      return NextResponse.json(
        {
          error:
            "Format tidak didukung. Hanya menerima gambar raster JPG, PNG, atau WebP (SVG tidak diizinkan demi keamanan).",
        },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Ukuran gambar harus antara 1 byte hingga 5 MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const detectedExt = detectRasterImageExt(buffer);
    if (!detectedExt || detectedExt !== declaredExt) {
      return NextResponse.json(
        {
          error:
            "Isi file tidak cocok dengan format gambar JPG, PNG, atau WebP yang valid.",
        },
        { status: 400 }
      );
    }

    const rawName = path.basename(file.name, path.extname(file.name));
    const safeBase = slugify(rawName).slice(0, 32) || "gambar";
    const randomSuffix = crypto.randomBytes(6).toString("hex");
    const filename = `${Date.now().toString(36)}-${randomSuffix}-${safeBase}${detectedExt}`;

    const uploadDir = path.resolve(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const targetPath = path.resolve(uploadDir, filename);
    if (!targetPath.startsWith(uploadDir + path.sep)) {
      return NextResponse.json(
        { error: "Nama file tidak valid." },
        { status: 400 }
      );
    }

    await fs.writeFile(targetPath, buffer);

    logSecurityEvent({
      event: "ADMIN_UPLOAD_IMAGE",
      actor: auth.session.username,
      ip,
      target: `/uploads/${filename}`,
      detail: `bytes=${buffer.length}`,
    });

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengunggah gambar." },
      { status: 500 }
    );
  }
}
