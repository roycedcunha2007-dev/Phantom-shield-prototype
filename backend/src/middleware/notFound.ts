import type { Request, Response } from "express";
import { errorResponse } from "../utils/apiResponse";

export function notFound(req: Request, res: Response) {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}
