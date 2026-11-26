import crypto from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(crypto.scrypt);
const KEY_LENGTH = 64;
const PREFIX = "scrypt";

/**
 * Hashes a plaintext password asynchronously using Node's native scrypt
 * offloaded to libuv worker threads (non-blocking event loop).
 * Format: scrypt$<saltHex>$<derivedKeyHex>
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${PREFIX}$${salt}$${derivedKey.toString("hex")}`;
}

/**
 * Verifies a plaintext password against a stored scrypt hash asynchronously
 * using constant-time comparison to prevent timing attacks.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const parts = storedHash.split("$");
  if (parts.length !== 3 || parts[0] !== PREFIX) return false;

  const [, salt, expectedHex] = parts;
  if (!salt || !expectedHex) return false;

  try {
    const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
    const expected = Buffer.from(expectedHex, "hex");
    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
