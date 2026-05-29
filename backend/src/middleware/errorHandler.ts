import type { ErrorRequestHandler } from "express";
import { errorResponse } from "../utils/apiResponse";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  return errorResponse(res, error.message || "Internal server error", statusCode, error);
};
