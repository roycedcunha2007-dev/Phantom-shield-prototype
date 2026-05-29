import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types";
import { getUserProfile, loginUser, registerUser } from "../services/authService";
import { successResponse } from "../utils/apiResponse";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await registerUser(req.body);
    return successResponse(res, result, 201);
  } catch (error) {
    return next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loginUser(req.body);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

export async function profile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const result = await getUserProfile(req.user!.id);
    return successResponse(res, result);
  } catch (error) {
    return next(error);
  }
}

export function logout(_req: Request, res: Response) {
  return successResponse(res, { message: "Logout acknowledged. Remove the token client-side." });
}
