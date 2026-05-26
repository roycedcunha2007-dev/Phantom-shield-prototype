import type { ReactNode } from "react";
import { toClassName } from "@/utils/risk";

export function Badge({ value, children }: { value: string; children?: ReactNode }) {
  return <span className={`badge ${toClassName(value)}`}>{children ?? value}</span>;
}
