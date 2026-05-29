import { Recommendation } from "../models/Recommendation";

export async function listRecommendations() {
  return Recommendation.find().sort({ _id: -1 });
}

export async function createRecommendation(input: Record<string, unknown>) {
  // TODO: integrate AI risk engine
  return Recommendation.create(input);
}

export async function applyRecommendation(id: string) {
  const recommendation = await Recommendation.findByIdAndUpdate(id, { applied: true }, { new: true, runValidators: true });
  if (!recommendation) {
    const error = new Error("Recommendation not found") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }
  return recommendation;
}
