import type { Recommendation } from "@/types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getRecommendations(): Promise<Recommendation[]> {
  const response = await fetch(`${apiBaseUrl}/api/recommendations`);
  if (!response.ok) throw new Error("Unable to load recommendations");
  return response.json() as Promise<Recommendation[]>;
}
