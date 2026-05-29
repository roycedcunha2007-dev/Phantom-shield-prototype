import { Router } from "express";
import { applyRecommendationHandler, createRecommendationHandler, getRecommendations } from "../controllers/recommendationController";
import { auth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { idValidator, recommendationCreateValidators } from "../middleware/validators";

export const recommendationRoutes = Router();

recommendationRoutes.use(auth);
recommendationRoutes.get("/", getRecommendations);
recommendationRoutes.post("/", recommendationCreateValidators, validate, createRecommendationHandler);
recommendationRoutes.patch("/:id/apply", idValidator, validate, applyRecommendationHandler);
