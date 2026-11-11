
import mongoose, { Schema, models, model } from "mongoose";

const EnquirySchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
      default: "",
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    source: {
      type: String,
      enum: ["enquiry", "register-interest", "contact"],
      default: "enquiry",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New",
    },
    websiteSource: {
      type: String,
      trim: true,
      lowercase: true,
      required: false,
    },
  },
  { timestamps: true }
);

// Indexes for high-frequency dashboard queries and multi-website filtering
EnquirySchema.index({ websiteSource: 1, createdAt: -1 });
EnquirySchema.index({ status: 1, createdAt: -1 });

export default models.Enquiry ||
  model("Enquiry", EnquirySchema);
