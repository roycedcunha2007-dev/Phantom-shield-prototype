import type { AIRecommendation, AIRiskResponse } from "@/types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getAIRisk(): Promise<AIRiskResponse> {
  const response = await fetch(`${apiBaseUrl}/api/ai/risk`);
  if (!response.ok) throw new Error("Unable to load AI risk");
  return response.json() as Promise<AIRiskResponse>;
}

export async function getAIRecommendations(): Promise<AIRecommendation[]> {
  const response = await fetch(`${apiBaseUrl}/api/ai/recommendations`);
  if (!response.ok) throw new Error("Unable to load AI recommendations");
  return response.json() as Promise<AIRecommendation[]>;
}
