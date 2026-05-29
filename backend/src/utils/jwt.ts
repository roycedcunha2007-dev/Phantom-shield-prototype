import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import type { JwtPayload } from "../types";

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, env.jwtSecret as Secret, { expiresIn: env.jwtExpiresIn } as SignOptions);
}
