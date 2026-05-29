import type { Response } from "express";

export function successResponse<T>(res: Response, data: T, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

export function errorResponse(res: Response, message: string, statusCode = 500, error?: unknown) {
  const normalizedError = error instanceof Error ? error.message : error;
  return res.status(statusCode).json({
    success: false,
    message,
    error: normalizedError || message,
  });
}
