/**
 * Local helper to generate a salted scrypt password hash for ADMIN_PASSWORD_HASH.
 *
 * Usage (do not commit the password or output into git):
 *   node scripts/generate-admin-hash.mjs
 *   node scripts/generate-admin-hash.mjs "your-new-password"
 *
 * Then set the printed hash in Vercel / local env as ADMIN_PASSWORD_HASH.
 * Also rotate ADMIN_SESSION_SECRET to a new random value (32+ characters).
 */

import { randomBytes, scrypt as scryptCallback } from "crypto";
import { promisify } from "util";
import { createInterface } from "readline";

const scrypt = promisify(scryptCallback);

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;
const SALT_BYTES = 16;

async function hashPassword(password) {
  const salt = randomBytes(SALT_BYTES);
  const derived = await scrypt(password, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });

  return [
    "scrypt",
    String(SCRYPT_N),
    String(SCRYPT_R),
    String(SCRYPT_P),
    salt.toString("base64"),
    derived.toString("base64"),
  ].join("$");
}

function readPasswordHidden(prompt) {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    const stdin = process.stdin;
    const onData = (char) => {
      char = char.toString();
      switch (char) {
        case "\n":
        case "\r":
        case "\u0004":
          stdin.removeListener("data", onData);
          break;
        default:
          // Prevent echo of password characters when possible
          if (stdin.isTTY) {
            process.stdout.clearLine?.(0);
            process.stdout.cursorTo?.(0);
            process.stdout.write(prompt + "*".repeat(rl.line.length));
          }
          break;
      }
    };

    if (stdin.isTTY) {
      stdin.on("data", onData);
    }

    rl.question(prompt, (answer) => {
      if (stdin.isTTY) {
        stdin.removeListener("data", onData);
      }
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  let password = process.argv[2];

  if (!password) {
    password = await readPasswordHidden("Enter new admin password: ");
    process.stdout.write("\n");
  }

  if (!password || password.length < 12) {
    console.error("Password must be at least 12 characters.");
    process.exit(1);
  }

  const hash = await hashPassword(password);
  const sessionSecret = randomBytes(32).toString("base64url");

  console.log("");
  console.log("Set these in Vercel (Production / Preview) and local .env.local:");
  console.log("(Values below are printed once — store them securely, do not commit.)");
  console.log("");
  console.log("ADMIN_PASSWORD_HASH=");
  console.log(hash);
  console.log("");
  console.log("Suggested ADMIN_SESSION_SECRET (rotate on deploy):");
  console.log(sessionSecret);
  console.log("");
  console.log("Also ensure ADMIN_EMAIL is set to the admin login identifier.");
  console.log("MONGODB_URI must already be configured (unchanged name).");
}

main().catch((err) => {
  console.error("Failed to generate hash.");
  process.exit(1);
});
