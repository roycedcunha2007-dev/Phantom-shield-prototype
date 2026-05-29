import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User";
import type { AuthenticatedRequest, JwtPayload } from "../types";
import { errorResponse } from "../utils/apiResponse";

export async function auth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : undefined;
    if (!token) return errorResponse(res, "Authentication token required", 401);

    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    const userExists = await User.exists({ _id: decoded.id });
    if (!userExists) return errorResponse(res, "User no longer exists", 401);

    req.user = decoded;
    return next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired token", 401, error);
  }
}
