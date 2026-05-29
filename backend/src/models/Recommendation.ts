import mongoose, { Schema } from "mongoose";
import type { Severity } from "../types";

export interface IRecommendation {
  title: string;
  severity: Severity;
  explanation: string;
  action: string;
  applied: boolean;
}

const recommendationSchema = new Schema<IRecommendation>(
  {
    title: { type: String, required: true, trim: true },
    severity: { type: String, enum: ["Low", "Medium", "High", "Critical"], required: true },
    explanation: { type: String, required: true, trim: true },
    action: { type: String, required: true, trim: true },
    applied: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const Recommendation = mongoose.model<IRecommendation>("Recommendation", recommendationSchema);
