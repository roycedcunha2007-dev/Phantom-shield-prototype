import type { Device } from "@/types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getDevices(): Promise<Device[]> {
  const response = await fetch(`${apiBaseUrl}/api/devices`);
  if (!response.ok) throw new Error("Unable to load devices");
  return response.json() as Promise<Device[]>;
}
