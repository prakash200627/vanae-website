export const SESSION_COOKIE_NAME = "vanae_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

/** Minimum length for ADMIN_SESSION_SECRET (UTF-8 code units). */
const MIN_SESSION_SECRET_LENGTH = 32;

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret || secret.length < MIN_SESSION_SECRET_LENGTH) {
    return null;
  }
  return secret;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates a signed session token. Returns null if ADMIN_SESSION_SECRET is
 * missing, empty, or below the minimum entropy length.
 */
export async function createSessionToken(
  username: string
): Promise<string | null> {
  const secret = getSessionSecret();
  if (!secret) {
    return null;
  }

  const key = await getHmacKey(secret);

  const payload = {
    sub: username,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };

  const enc = new TextEncoder();
  const payloadBytes = enc.encode(JSON.stringify(payload));
  const payloadB64 = toBase64Url(payloadBytes);

  const signatureBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(payloadB64)
  );
  const signatureB64 = toBase64Url(new Uint8Array(signatureBuf));

  return `${payloadB64}.${signatureB64}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<{ valid: boolean; user?: string }> {
  if (!token || typeof token !== "string") {
    return { valid: false };
  }

  const secret = getSessionSecret();
  if (!secret) {
    return { valid: false };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false };
  }

  const [payloadB64, signatureB64] = parts;

  try {
    const key = await getHmacKey(secret);

    const enc = new TextEncoder();
    const signatureBytes = fromBase64Url(signatureB64);

    const isValidSig = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      enc.encode(payloadB64)
    );

    if (!isValidSig) {
      return { valid: false };
    }

    const payloadBytes = fromBase64Url(payloadB64);
    const dec = new TextDecoder();
    const payload = JSON.parse(dec.decode(payloadBytes));

    if (typeof payload.exp !== "number" || payload.exp < Date.now()) {
      return { valid: false };
    }

    if (typeof payload.sub !== "string" || !payload.sub) {
      return { valid: false };
    }

    return { valid: true, user: payload.sub };
  } catch {
    return { valid: false };
  }
}

export function getSessionCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
