import type { Severity } from "@/types";

export function getRiskLevel(score: number): Severity {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

export function toClassName(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}
