import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
  type ScryptOptions,
} from "crypto";

function scryptAsync(
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keylen, options, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(derivedKey as Buffer);
    });
  });
}

/** scrypt$N$r$p$saltB64$urlHashB64 */
const HASH_PREFIX = "scrypt";
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;
const SALT_BYTES = 16;

function constantTimeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

function getConfiguredAdminIdentifier(): string | null {
  const email = process.env.ADMIN_EMAIL?.trim();
  const username = process.env.ADMIN_USERNAME?.trim();
  const configured = email || username;
  if (!configured) {
    return null;
  }
  return configured.toLowerCase();
}

function getConfiguredPasswordHash(): string | null {
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (!hash) {
    return null;
  }
  return hash;
}

function isValidScryptHash(encoded: string): boolean {
  const parts = encoded.split("$");
  if (parts.length !== 6 || parts[0] !== HASH_PREFIX) {
    return false;
  }
  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p)) {
    return false;
  }
  if (n < 1024 || r < 1 || p < 1) {
    return false;
  }
  try {
    const salt = Buffer.from(parts[4], "base64");
    const hash = Buffer.from(parts[5], "base64");
    return salt.length >= 8 && hash.length >= 32;
  } catch {
    return false;
  }
}

/**
 * Hash a password with salted scrypt.
 * Format: scrypt$N$r$p$saltB64$hashB64
 *
 * Intended for local credential generation / ops scripts — not for Edge runtime.
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error("Password must not be empty.");
  }

  const salt = randomBytes(SALT_BYTES);
  const derived = await scryptAsync(password, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });

  return [
    HASH_PREFIX,
    String(SCRYPT_N),
    String(SCRYPT_R),
    String(SCRYPT_P),
    salt.toString("base64"),
    derived.toString("base64"),
  ].join("$");
}

async function verifyScryptPassword(
  plainPassword: string,
  encoded: string
): Promise<boolean> {
  if (!isValidScryptHash(encoded)) {
    return false;
  }

  const parts = encoded.split("$");
  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  const salt = Buffer.from(parts[4], "base64");
  const expected = Buffer.from(parts[5], "base64");

  const derived = await scryptAsync(plainPassword, salt, expected.length, {
    N,
    r,
    p,
  });

  if (derived.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(derived, expected);
}

/**
 * Verifies admin credentials against required environment configuration.
 * Fails closed when ADMIN_EMAIL/ADMIN_USERNAME, or ADMIN_PASSWORD_HASH is
 * missing, empty, or not a valid scrypt hash. Legacy SHA-256 hashes are rejected.
 */
export async function verifyAdminCredentials(
  identifier: string,
  plainPassword: string
): Promise<boolean> {
  const configuredIdentifier = getConfiguredAdminIdentifier();
  const expectedHash = getConfiguredPasswordHash();

  if (!configuredIdentifier || !expectedHash) {
    return false;
  }

  if (!isValidScryptHash(expectedHash)) {
    return false;
  }

  const trimmedIdentifier = identifier.trim().toLowerCase();
  if (!constantTimeEqualStrings(trimmedIdentifier, configuredIdentifier)) {
    // Still run a dummy verify-shaped delay path is unnecessary; reject early
    // after constant-time identifier compare. Password is not checked on mismatch.
    return false;
  }

  if (!plainPassword) {
    return false;
  }

  try {
    return await verifyScryptPassword(plainPassword, expectedHash);
  } catch {
    return false;
  }
}

/**
 * Returns whether required admin auth env vars are present and valid enough
 * to attempt login (does not reveal values).
 */
export function isAdminAuthConfigured(): boolean {
  const identifier = getConfiguredAdminIdentifier();
  const hash = getConfiguredPasswordHash();
  return Boolean(identifier && hash && isValidScryptHash(hash));
}
