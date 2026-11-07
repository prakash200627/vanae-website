import { NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/lib/adminCredentials";
import {
  createSessionToken,
  getSessionCookieOptions,
} from "@/lib/auth";
import { getClientIp } from "@/lib/clientIp";
import {
  isRateLimited,
  recordAttempt,
  resetRateLimit,
  RateLimitStoreError,
} from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function serviceUnavailable() {
  return NextResponse.json(
    {
      success: false,
      message: "Service temporarily unavailable. Please try again later.",
    },
    { status: 503 }
  );
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateKey = `admin_login_${ip}`;

    let rateCheck;
    try {
      // Rate limit: max 5 failed login attempts per 15 minutes per IP
      rateCheck = await isRateLimited(rateKey, 5, 15 * 60 * 1000);
    } catch (error) {
      if (error instanceof RateLimitStoreError) {
        return serviceUnavailable();
      }
      throw error;
    }

    if (rateCheck.limited) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many login attempts. Please wait 15 minutes before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const identifier =
      typeof body.identifier === "string"
        ? body.identifier.trim()
        : typeof body.email === "string"
          ? body.email.trim()
          : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: "Email/username and password are required." },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminCredentials(identifier, password);
    if (!isValid) {
      try {
        await recordAttempt(rateKey, 15 * 60 * 1000);
      } catch (error) {
        if (error instanceof RateLimitStoreError) {
          return serviceUnavailable();
        }
        throw error;
      }

      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    try {
      await resetRateLimit(rateKey);
    } catch (error) {
      if (error instanceof RateLimitStoreError) {
        return serviceUnavailable();
      }
      throw error;
    }

    const token = await createSessionToken(identifier);
    if (!token) {
      console.error("Admin login aborted: session secret is not configured.");
      return serviceUnavailable();
    }

    const cookieOptions = getSessionCookieOptions();

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
      },
      { status: 200 }
    );

    response.cookies.set({
      ...cookieOptions,
      value: token,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
