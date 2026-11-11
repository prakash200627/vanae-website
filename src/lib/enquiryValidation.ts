/**
 * Shared enquiry form validation utilities.
 * Used by both the frontend (EnquiryModal) and the backend API route.
 */

/**
 * Validate an email address.
 * Rules:
 *  - Required (non-empty after trim)
 *  - No whitespace anywhere (including internal spaces)
 *  - Must match local@domain.tld where TLD is at least 2 characters
 *  - Rejects bare domain like `demo@gmail` (no dot in domain part after @)
 */
export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return false;
  // Reject any whitespace anywhere in the address
  if (/\s/.test(trimmed)) return false;
  // local @ domain . tld (tld >= 2 chars)
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
}

/**
 * Normalize and validate an Indian mobile number.
 * Accepted input formats:
 *  - 10-digit number starting with 6-9 (e.g. 9876543210)
 *  - With +91 prefix   (e.g. +919876543210, +91 98765 43210)
 *  - With 91 prefix    (e.g. 919876543210)
 *  - With spaces, hyphens or parentheses as separators (stripped before check)
 *
 * Returns the normalized form `+91XXXXXXXXXX` on success, or `null` on failure.
 */
export function normalizeIndianPhone(raw: string): string | null {
  // Strip spaces, hyphens and parentheses only — preserve leading '+' and digits
  const cleaned = raw.replace(/[\s\-()]/g, "");

  // Reject alphabetic characters (e.g. letters mixed in)
  if (/[a-zA-Z]/.test(cleaned)) return null;

  // Extract only digits (removes the leading '+' if present)
  const digits = cleaned.replace(/\D/g, "");

  let national = digits;

  // Strip country code 91 if present
  if (digits.startsWith("91") && digits.length === 12) {
    national = digits.slice(2);
  }

  // Must be exactly 10 digits
  if (national.length !== 10) return null;

  // Must start with 6, 7, 8, or 9
  if (!/^[6-9]/.test(national)) return null;

  return `+91${national}`;
}

/**
 * Validate a full name.
 * Rules:
 *  - Required (non-empty after trim)
 *  - Maximum 100 characters
 *  - Must not be purely numeric (e.g. "12345")
 */
export function isValidFullName(name: string): boolean {
  const t = name.trim();
  if (!t) return false;
  if (t.length > 100) return false;
  if (/^\d+$/.test(t)) return false;
  return true;
}
