import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { logSecurityEvent } from "@/lib/server/audit-log";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limit";
import { isR2Configured, uploadImageToR2 } from "@/lib/server/r2-storage";
import { slugify } from "@/lib/format";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB raw upload cap
const MAX_INPUT_PIXELS = 25_000_000; // 25 MP decompression-bomb protection
const MAX_IMAGE_DIMENSION = 1600;
const WEBP_QUALITY = 82;
const UPLOAD_RATE_LIMIT = 60;
const UPLOAD_RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const ALLOWED_FOLDERS = new Set<"products" | "home" | "general">([
  "products",
  "home",
  "general",
]);

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

/**
 * Converts any verified raster image (JPG/PNG/WebP) to optimized WebP,
 * normalizes EXIF rotation, strips metadata, and caps dimensions at 1600px.
 */
async function convertToOptimizedWebp(inputBuffer: Buffer): Promise<Buffer> {
  return sharp(inputBuffer, { limitInputPixels: MAX_INPUT_PIXELS })
    .rotate()
    .resize({
      width: MAX_IMAGE_DIMENSION,
      height: MAX_IMAGE_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();
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
    const rawFolder =
      typeof formData.get("folder") === "string"
        ? String(formData.get("folder")).trim().toLowerCase()
        : "products";
    const folder: "products" | "home" | "general" = ALLOWED_FOLDERS.has(
      rawFolder as "products" | "home" | "general"
    )
      ? (rawFolder as "products" | "home" | "general")
      : "products";

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

    const rawBuffer = Buffer.from(await file.arrayBuffer());
    const detectedExt = detectRasterImageExt(rawBuffer);
    if (!detectedExt || detectedExt !== declaredExt) {
      return NextResponse.json(
        {
          error:
            "Isi file tidak cocok dengan format gambar JPG, PNG, atau WebP yang valid.",
        },
        { status: 400 }
      );
    }

    let webpBuffer: Buffer;
    try {
      webpBuffer = await convertToOptimizedWebp(rawBuffer);
    } catch {
      return NextResponse.json(
        {
          error:
            "Gagal memproses gambar ke format WebP. Pastikan file gambar tidak rusak dan resolusinya wajar.",
        },
        { status: 400 }
      );
    }

    const rawName = path.basename(file.name, path.extname(file.name));
    const safeBase = slugify(rawName).slice(0, 32) || "gambar";
    const randomSuffix = crypto.randomBytes(6).toString("hex");
    const filename = `${Date.now().toString(36)}-${randomSuffix}-${safeBase}.webp`;

    // Primary production path: upload WebP directly to Cloudflare R2 bucket
    if (isR2Configured()) {
      const uploaded = await uploadImageToR2({
        buffer: webpBuffer,
        contentType: "image/webp",
        folder,
        filename,
      });

      logSecurityEvent({
        event: "ADMIN_UPLOAD_IMAGE",
        actor: auth.session.username,
        ip,
        target: uploaded.url,
        detail: `storage=r2 format=webp key=${uploaded.key} originalBytes=${rawBuffer.length} webpBytes=${webpBuffer.length}`,
      });

      return NextResponse.json(
        { url: uploaded.url, storage: "r2", key: uploaded.key },
        { status: 201 }
      );
    }

    // Fail closed in production if Cloudflare R2 credentials are missing
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            "Bucket Cloudflare R2 belum dikonfigurasi pada server produksi. Lengkapi R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, dan R2_PUBLIC_URL di environment.",
        },
        { status: 503 }
      );
    }

    // Local development fallback before Cloudflare R2 keys are pasted in .env
    const uploadDir = path.resolve(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const targetPath = path.resolve(uploadDir, filename);
    if (!targetPath.startsWith(uploadDir + path.sep)) {
      return NextResponse.json(
        { error: "Nama file tidak valid." },
        { status: 400 }
      );
    }

    await fs.writeFile(targetPath, webpBuffer);

    logSecurityEvent({
      event: "ADMIN_UPLOAD_IMAGE",
      actor: auth.session.username,
      ip,
      target: `/uploads/${filename}`,
      detail: `storage=local format=webp originalBytes=${rawBuffer.length} webpBytes=${webpBuffer.length}`,
    });

    return NextResponse.json(
      { url: `/uploads/${filename}`, storage: "local" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Gagal mengunggah gambar ke storage." },
      { status: 500 }
    );
  }
}
