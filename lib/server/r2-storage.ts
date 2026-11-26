import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicBaseUrl: string;
}

const globalForR2 = globalThis as unknown as {
  __cr7R2Client?: S3Client;
  __cr7R2ClientKey?: string;
};

function readR2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID?.trim() ?? "";
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim() ?? "";
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim() ?? "";
  const bucketName = process.env.R2_BUCKET_NAME?.trim() ?? "";
  const rawPublicUrl = (
    process.env.R2_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
    ""
  )
    .trim()
    .replace(/\/+$/, "");

  if (
    !accountId ||
    !accessKeyId ||
    !secretAccessKey ||
    !bucketName ||
    !rawPublicUrl
  ) {
    return null;
  }

  try {
    const parsed = new URL(rawPublicUrl);
    if (parsed.protocol !== "https:") return null;
  } catch {
    return null;
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicBaseUrl: rawPublicUrl,
  };
}

export function isR2Configured(): boolean {
  return readR2Config() !== null;
}

export function getR2PublicBaseUrl(): string | null {
  return readR2Config()?.publicBaseUrl ?? null;
}

function getR2Client(cfg: R2Config): S3Client {
  const cacheKey = `${cfg.accountId}:${cfg.accessKeyId}:${cfg.bucketName}`;
  if (globalForR2.__cr7R2Client && globalForR2.__cr7R2ClientKey === cacheKey) {
    return globalForR2.__cr7R2Client;
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
  });

  globalForR2.__cr7R2Client = client;
  globalForR2.__cr7R2ClientKey = cacheKey;
  return client;
}

export async function uploadImageToR2(input: {
  buffer: Buffer;
  contentType: string;
  folder: "products" | "home" | "general";
  filename: string;
}): Promise<{ url: string; key: string }> {
  const cfg = readR2Config();
  if (!cfg) {
    throw new Error("R2_NOT_CONFIGURED");
  }

  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const key = `${input.folder}/${year}/${month}/${input.filename}`;

  const client = getR2Client(cfg);
  await client.send(
    new PutObjectCommand({
      Bucket: cfg.bucketName,
      Key: key,
      Body: input.buffer,
      ContentType: input.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return {
    key,
    url: `${cfg.publicBaseUrl}/${key}`,
  };
}

export async function deleteR2ObjectByUrl(url: string): Promise<boolean> {
  const cfg = readR2Config();
  if (!cfg) return false;

  const prefix = `${cfg.publicBaseUrl}/`;
  if (!url.startsWith(prefix)) return false;

  const key = url.slice(prefix.length).replace(/^\/+/, "");
  if (!key || key.includes("..")) return false;

  try {
    const client = getR2Client(cfg);
    await client.send(
      new DeleteObjectCommand({
        Bucket: cfg.bucketName,
        Key: key,
      })
    );
    return true;
  } catch {
    return false;
  }
}
