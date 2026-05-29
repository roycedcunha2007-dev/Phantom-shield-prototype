import mongoose, { Schema } from "mongoose";
import type { DeviceStatus } from "../types";

export interface IDevice {
  name: string;
  owner: string;
  type: string;
  status: DeviceStatus;
  risk: number;
  lastActivity: string;
  createdAt: Date;
  updatedAt: Date;
}

const deviceSchema = new Schema<IDevice>(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Online", "Offline", "Quarantined"], default: "Online" },
    risk: { type: Number, min: 0, max: 100, default: 0 },
    lastActivity: { type: String, required: true, default: "Just now" },
  },
  {
    timestamps: true,
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

export const Device = mongoose.model<IDevice>("Device", deviceSchema);
