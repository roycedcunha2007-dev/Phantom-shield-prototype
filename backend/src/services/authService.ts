import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import type { UserRole } from "../types";

export async function registerUser(input: { name: string; email: string; password: string; role: UserRole }) {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    const error = new Error("Email is already registered") as Error & { statusCode?: number };
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create(input);
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { user, token };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await User.findOne({ email: input.email }).select("+password");
  if (!user || !(await user.comparePassword(input.password))) {
    const error = new Error("Invalid credentials") as Error & { statusCode?: number };
    error.statusCode = 401;
    throw error;
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { user, token };
}

export async function getUserProfile(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }
  return user;
}
