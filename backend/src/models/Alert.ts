import mongoose, { Schema, Types } from "mongoose";
import type { AlertStatus, Severity } from "../types";

export interface IAlert {
  type: string;
  severity: Severity;
  timestamp: string;
  status: AlertStatus;
  deviceId: Types.ObjectId;
  ipAddress: string;
  openedTabs: string[];
  suspiciousBehaviors: string[];
  highAlertReason: string;
}

const alertSchema = new Schema<IAlert>(
  {
    type: { type: String, required: true, trim: true },
    severity: { type: String, enum: ["Low", "Medium", "High", "Critical"], required: true },
    timestamp: { type: String, required: true },
    status: { type: String, enum: ["Open", "Investigating", "Blocked", "Resolved"], default: "Open" },
    deviceId: { type: Schema.Types.ObjectId, ref: "Device", required: true },
    ipAddress: { type: String, required: true, trim: true },
    openedTabs: [{ type: String, trim: true }],
    suspiciousBehaviors: [{ type: String, trim: true }],
    highAlertReason: { type: String, required: true, trim: true },
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

export const Alert = mongoose.model<IAlert>("Alert", alertSchema);
