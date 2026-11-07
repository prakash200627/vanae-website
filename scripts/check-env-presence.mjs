/**
 * Reports presence/format of required env vars without printing values.
 * Usage: node scripts/check-env-presence.mjs
 */
import fs from "fs";
import mongoose from "mongoose";

const files = [
  ".env",
  ".env.local",
  ".env.development",
  ".env.development.local",
];

const merged = {};
const presentFiles = [];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  presentFiles.push(f);
  for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    merged[k] = v;
  }
}

function report(name, detail) {
  console.log(`${name}=${detail}`);
}

console.log(`ENV_FILES_PRESENT=${presentFiles.join(",") || "none"}`);

const mongo = merged.MONGODB_URI?.trim() || "";
if (!mongo) report("MONGODB_URI", "missing_or_empty");
else if (/^mongodb(\+srv)?:\/\//i.test(mongo))
  report("MONGODB_URI", "set_format_ok");
else report("MONGODB_URI", "set_format_unexpected");

const email = merged.ADMIN_EMAIL?.trim() || "";
const username = merged.ADMIN_USERNAME?.trim() || "";
report("ADMIN_EMAIL", email ? "set" : "missing_or_empty");
report("ADMIN_USERNAME", username ? "set" : "missing_or_empty");
report(
  "ADMIN_IDENTIFIER_PRESENT",
  email || username ? "yes" : "no"
);

const hash = merged.ADMIN_PASSWORD_HASH?.trim() || "";
if (!hash) report("ADMIN_PASSWORD_HASH", "missing_or_empty");
else if (/^scrypt\$\d+\$\d+\$\d+\$/.test(hash))
  report("ADMIN_PASSWORD_HASH", "set_scrypt_format");
else report("ADMIN_PASSWORD_HASH", "set_not_scrypt_format");

const secret = merged.ADMIN_SESSION_SECRET?.trim() || "";
if (!secret) report("ADMIN_SESSION_SECRET", "missing_or_empty");
else if (secret.length >= 32) report("ADMIN_SESSION_SECRET", "set_len_ok_ge32");
else report("ADMIN_SESSION_SECRET", "set_len_too_short_lt32");

report(
  "ADMIN_PASSWORD",
  merged.ADMIN_PASSWORD?.trim()
    ? "set_but_unused_by_auth_path"
    : "missing_or_empty"
);

const probe = process.argv.includes("--probe-mongo");
if (probe && mongo && /^mongodb(\+srv)?:\/\//i.test(mongo)) {
  const started = Date.now();
  try {
    await mongoose.connect(mongo, {
      serverSelectionTimeoutMS: 8000,
    });
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(`MONGODB_PROBE=ok_ms_${Date.now() - started}`);
    await mongoose.disconnect();
  } catch (err) {
    const name = err && err.name ? err.name : "Error";
    const code = err && err.code ? String(err.code) : "";
    console.log(
      `MONGODB_PROBE=fail_${name}${code ? "_" + code : ""}_ms_${Date.now() - started}`
    );
    try {
      await mongoose.disconnect();
    } catch {
      /* ignore */
    }
    process.exitCode = 2;
  }
}
