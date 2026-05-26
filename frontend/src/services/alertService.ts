import type { Alert } from "@/types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getAlerts(): Promise<Alert[]> {
  const response = await fetch(`${apiBaseUrl}/api/alerts`);
  if (!response.ok) throw new Error("Unable to load alerts");
  return response.json() as Promise<Alert[]>;
}
