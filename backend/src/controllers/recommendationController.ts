import type { Request, Response, NextFunction } from "express";
import { applyRecommendation, createRecommendation, listRecommendations } from "../services/recommendationService";
import { successResponse } from "../utils/apiResponse";

export async function getRecommendations(_req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, await listRecommendations());
  } catch (error) {
    return next(error);
  }
}

export async function createRecommendationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, await createRecommendation(req.body), 201);
  } catch (error) {
    return next(error);
  }
}

export async function applyRecommendationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, await applyRecommendation(req.params.id));
  } catch (error) {
    return next(error);
  }
}
