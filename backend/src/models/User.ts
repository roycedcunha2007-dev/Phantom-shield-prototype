import bcrypt from "bcrypt";
import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";
import type { UserRole } from "../types";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

const userSchema = new Schema<IUser, Model<IUser, {}, IUserMethods>, IUserMethods>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["Admin", "Employee"], required: true, default: "Employee" },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.method("comparePassword", function comparePassword(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
});

export const User = mongoose.model<IUser, Model<IUser, {}, IUserMethods>>("User", userSchema);
