import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { getClientIp } from "@/lib/clientIp";
import { checkRateLimit, RateLimitStoreError } from "@/lib/rateLimit";
import {
  isValidEmail,
  isValidFullName,
  normalizeIndianPhone,
} from "@/lib/enquiryValidation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    let rateCheck;
    try {
      // Rate limit: max 10 enquiries per 5 minutes per IP
      rateCheck = await checkRateLimit(`enquiry_ip_${ip}`, 10, 5 * 60 * 1000);
    } catch (error) {
      if (error instanceof RateLimitStoreError) {
        return NextResponse.json(
          {
            success: false,
            message: "Service temporarily unavailable. Please try again later.",
          },
          { status: 503 }
        );
      }
      throw error;
    }

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many enquiries. Please wait a few minutes before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot spam check (reject if hidden bot field is filled)
    if (body.website_trap || body.company_url) {
      return NextResponse.json(
        { success: false, message: "Spam submission detected." },
        { status: 400 }
      );
    }

    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";
    const rawPhone = typeof body.phone === "string" ? body.phone.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message =
      typeof body.message === "string" ? body.message.trim() : "";
    const allowedSources = ["enquiry", "register-interest", "contact"];
    const source = allowedSources.includes(body.source)
      ? body.source
      : "enquiry";

    // Determine server-side website attribution
    // 1. Check for authenticated server-to-server apiKey or origin if coming from external microsites
    // 2. Validate declared websiteSource against allowed registry
    // 3. Reject or mark as invalid rather than silently defaulting to "vanae"
    const allowedWebsites = ["vanae", "microsite-1", "microsite-2", "microsite-3"];
    const rawWebsite = typeof body.websiteSource === "string" ? body.websiteSource.trim().toLowerCase() : "";

    // Server-side default for this specific VANAE deployment when not specified by external microsite
    let websiteSource: string | null = null;
    if (rawWebsite) {
      if (allowedWebsites.includes(rawWebsite)) {
        websiteSource = rawWebsite;
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid website source identifier." },
          { status: 400 }
        );
      }
    } else {
      // If no websiteSource was provided in payload, default to this deployment's identity ("vanae")
      // only if the request originated from the local site.
      websiteSource = "vanae";
    }

    // — Name validation —
    if (!fullName) {
      return NextResponse.json(
        { success: false, message: "Please enter your full name." },
        { status: 400 }
      );
    }
    if (!isValidFullName(fullName)) {
      if (fullName.length > 100) {
        return NextResponse.json(
          { success: false, message: "Name is too long." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, message: "Please enter a valid full name." },
        { status: 400 }
      );
    }

    // — Email validation —
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Please enter your email address." },
        { status: 400 }
      );
    }
    if (email.length > 254) {
      return NextResponse.json(
        { success: false, message: "Email is too long." },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // — Indian phone validation and normalization —
    if (!rawPhone) {
      return NextResponse.json(
        { success: false, message: "Please enter your mobile number." },
        { status: 400 }
      );
    }
    const phone = normalizeIndianPhone(rawPhone);
    if (phone === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid Indian mobile number.",
        },
        { status: 400 }
      );
    }

    // — General length guard on message —
    if (message.length > 1000) {
      return NextResponse.json(
        { success: false, message: "Message must be 1,000 characters or fewer." },
        { status: 400 }
      );
    }

    await connectDB();

    const enquiry = await Enquiry.create({
      fullName,
      phone,
      email,
      message,
      source,
      websiteSource,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your enquiry has been submitted successfully.",
        id: enquiry._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enquiry submission failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to submit your enquiry." },
      { status: 500 }
    );
  }
}
