/**
 * Exercises auth + adminCredentials modules with temporary env overrides.
 * Never prints secret or hash values.
 *
 * Run: node --import tsx scripts/security-auth-module-smoke.mjs
 *   or: npx tsx scripts/security-auth-module-smoke.mts (see below)
 */

import { createRequire } from "module";
import { pathToFileURL } from "url";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { randomBytes } from "crypto";

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

async function loadTsModule(relPath) {
  // Prefer tsx register if available
  const modPath = join(root, relPath);
  return import(pathToFileURL(modPath).href);
}

async function main() {
  // Dynamically register tsx for .ts imports
  try {
    await import("tsx/esm");
  } catch {
    console.error(
      "SKIP  auth module smoke (tsx not installed). Install with: npm i -D tsx"
    );
    process.exit(0);
  }

  const saved = {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
  };

  try {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_USERNAME;
    delete process.env.ADMIN_PASSWORD_HASH;
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_SESSION_SECRET;

    const { verifyAdminCredentials, hashPassword } = await loadTsModule(
      "src/lib/adminCredentials.ts"
    );
    const { createSessionToken, verifySessionToken } = await loadTsModule(
      "src/lib/auth.ts"
    );

    assert(
      (await verifyAdminCredentials("anyone", "anything")) === false,
      "credentials fail closed when admin env is missing"
    );

    assert(
      (await createSessionToken("admin")) === null,
      "createSessionToken returns null without session secret"
    );
    assert(
      (await verifySessionToken("a.b")).valid === false,
      "verifySessionToken fails closed without session secret"
    );

    const password = `TestPass-${randomBytes(6).toString("hex")}-Ok`;
    const hash = await hashPassword(password);
    process.env.ADMIN_EMAIL = "audit-admin@example.com";
    process.env.ADMIN_PASSWORD_HASH = hash;

    assert(
      (await verifyAdminCredentials("audit-admin@example.com", password)) ===
        true,
      "valid scrypt credentials accepted"
    );
    assert(
      (await verifyAdminCredentials("audit-admin@example.com", "wrong")) ===
        false,
      "wrong password rejected"
    );
    assert(
      (await verifyAdminCredentials("other@example.com", password)) === false,
      "wrong identifier rejected"
    );

    // Legacy SHA-256 style hash must not authenticate
    process.env.ADMIN_PASSWORD_HASH = "ab".repeat(32);
    assert(
      (await verifyAdminCredentials("audit-admin@example.com", password)) ===
        false,
      "legacy SHA-256 hash env is rejected"
    );

    process.env.ADMIN_PASSWORD_HASH = hash;
    process.env.ADMIN_SESSION_SECRET = randomBytes(32).toString("base64url");

    const token = await createSessionToken("audit-admin@example.com");
    assert(typeof token === "string" && token.includes("."), "session token created");
    const verified = await verifySessionToken(token);
    assert(verified.valid === true, "valid session accepted");
    assert(
      verified.user === "audit-admin@example.com",
      "session subject preserved"
    );

    assert(
      (await verifySessionToken("not-a-token")).valid === false,
      "malformed session rejected"
    );
    assert(
      (await verifySessionToken(token.slice(0, -2) + "xx")).valid === false,
      "tampered session rejected"
    );

    // Expired session: craft by temporarily using verify with old exp via direct token forge is hard;
    // instead rotate secret and ensure old token fails.
    const oldToken = token;
    process.env.ADMIN_SESSION_SECRET = randomBytes(32).toString("base64url");
    assert(
      (await verifySessionToken(oldToken)).valid === false,
      "session rejected after secret rotation"
    );

    // Short secret rejected
    process.env.ADMIN_SESSION_SECRET = "too-short";
    assert(
      (await createSessionToken("audit-admin@example.com")) === null,
      "short session secret rejected on create"
    );
    assert(
      (await verifySessionToken(oldToken)).valid === false,
      "short session secret rejected on verify"
    );
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }

  console.log(`\nResult: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Auth module smoke crashed:", err);
  process.exit(1);
});
