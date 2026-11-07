import mongoose, { Schema, models, model } from "mongoose";

const RateLimitSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    timestamps: {
      type: [Number],
      default: [],
    },
    /** Last admitted attempt timestamp (ms); used to detect admit vs deny races. */
    lastAdmit: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: false }
);

// MongoDB TTL monitor removes documents after expiresAt
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type RateLimitDocument = {
  key: string;
  timestamps: number[];
  lastAdmit: number;
  expiresAt: Date;
};

export default models.RateLimit || model("RateLimit", RateLimitSchema);
