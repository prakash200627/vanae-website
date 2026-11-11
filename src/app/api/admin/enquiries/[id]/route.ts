import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);

    if (!session.valid) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid enquiry ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const status = typeof body.status === "string" ? body.status.trim() : "";

    const allowedStatuses = ["New", "Contacted", "Closed"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status. Must be New, Contacted, or Closed.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after" }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status updated successfully.",
      enquiry: updated,
    });
  } catch (error) {
    console.error("Failed to update enquiry status:", error);
    return NextResponse.json(
      { success: false, message: "Unable to update enquiry status." },
      { status: 500 }
    );
  }
}
