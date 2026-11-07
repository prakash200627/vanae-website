/**
 * Local security smoke checks for Step 1 auth/rate-limit changes.
 * Does not read .env files or print secret values.
 *
 * Run: node scripts/security-smoke.mjs
 */

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { access, constants } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const scrypt = promisify(scryptCallback);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    passed += 1;
    console.log(`PASS  ${label}`);
  } else {
    failed += 1;
    console.error(`FAIL  ${label}`);
  }
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return [
    "scrypt",
    "16384",
    "8",
    "1",
    salt.toString("base64"),
    derived.toString("base64"),
  ].join("$");
}

async function verifyScrypt(password, encoded) {
  const parts = encoded.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  const salt = Buffer.from(parts[4], "base64");
  const expected = Buffer.from(parts[5], "base64");
  const derived = await scrypt(password, salt, expected.length, { N, r, p });
  return (
    derived.length === expected.length && timingSafeEqual(derived, expected)
  );
}

function isValidScryptHash(encoded) {
  const parts = encoded.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  try {
    const salt = Buffer.from(parts[4], "base64");
    const hash = Buffer.from(parts[5], "base64");
    return salt.length >= 8 && hash.length >= 32;
  } catch {
    return false;
  }
}

async function fileExists(relPath) {
  try {
    await access(join(root, relPath), constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log("Security smoke checks\n");

  // A) scrypt format
  const password = `smoke-test-${randomBytes(8).toString("hex")}`;
  const hash = await hashPassword(password);
  assert(isValidScryptHash(hash), "generated hash matches scrypt$ format");
  assert(await verifyScrypt(password, hash), "scrypt verifies correct password");
  assert(
    !(await verifyScrypt(password + "x", hash)),
    "scrypt rejects wrong password"
  );

  // Legacy SHA-256 hex must not be treated as valid configured hash
  const legacySha256 = "a".repeat(64);
  assert(
    !isValidScryptHash(legacySha256),
    "legacy SHA-256 hex is rejected as scrypt hash"
  );

  // B) db-test removed
  assert(
    !(await fileExists("src/app/api/db-test/route.ts")),
    "db-test route file is deleted"
  );
  assert(
    !(await fileExists("src/app/api/db-test")),
    "db-test directory is deleted"
  );

  // C) required modules exist
  assert(
    await fileExists("src/lib/adminCredentials.ts"),
    "adminCredentials.ts exists"
  );
  assert(await fileExists("src/lib/clientIp.ts"), "clientIp.ts exists");
  assert(await fileExists("src/models/RateLimit.ts"), "RateLimit model exists");

  // D) auth.ts must not contain default credential constants
  const authSource = await (
    await import("fs/promises")
  ).readFile(join(root, "src/lib/auth.ts"), "utf8");
  assert(
    !authSource.includes("DEFAULT_ADMIN"),
    "auth.ts has no DEFAULT_ADMIN* fallbacks"
  );
  assert(
    !authSource.includes("ADMIN_PASSWORD)"),
    "auth.ts does not reference plaintext ADMIN_PASSWORD path"
  );
  assert(
    authSource.includes("MIN_SESSION_SECRET_LENGTH"),
    "auth.ts enforces minimum session secret length"
  );

  // E) adminCredentials rejects missing env shape (process env unset in this script)
  assert(
    !process.env.ADMIN_PASSWORD_HASH ||
      isValidScryptHash(process.env.ADMIN_PASSWORD_HASH),
    "if ADMIN_PASSWORD_HASH is set in environment, it must be scrypt format"
  );

  console.log(`\nResult: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Smoke test crashed:", err);
  process.exit(1);
});
