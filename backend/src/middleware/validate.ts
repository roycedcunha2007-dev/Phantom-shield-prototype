import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { errorResponse } from "../utils/apiResponse";

export function validate(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  return errorResponse(res, "Validation failed", 400, result.array());
}
