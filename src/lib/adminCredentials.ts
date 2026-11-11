import { timingSafeEqual } from "crypto";

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

function getConfiguredAdminPassword(): string | null {
  const pwd = process.env.ADMIN_PASSWORD;
  if (typeof pwd !== "string" || !pwd) {
    return null;
  }
  return pwd;
}

/**
 * Verifies admin credentials against required environment configuration.
 * Uses ADMIN_PASSWORD with constant-time comparison as explicitly requested.
 */
export async function verifyAdminCredentials(
  identifier: string,
  plainPassword: string
): Promise<boolean> {
  const configuredIdentifier = getConfiguredAdminIdentifier();
  const configuredPassword = getConfiguredAdminPassword();

  if (!configuredIdentifier || !configuredPassword) {
    return false;
  }

  const trimmedIdentifier = identifier.trim().toLowerCase();
  const isIdentifierMatch = constantTimeEqualStrings(trimmedIdentifier, configuredIdentifier);

  if (!isIdentifierMatch || !plainPassword) {
    return false;
  }

  return constantTimeEqualStrings(plainPassword, configuredPassword);
}

/**
 * Returns whether required admin auth env vars are present and non-empty.
 */
export function isAdminAuthConfigured(): boolean {
  const identifier = getConfiguredAdminIdentifier();
  const password = getConfiguredAdminPassword();
  return Boolean(identifier && password);
}
