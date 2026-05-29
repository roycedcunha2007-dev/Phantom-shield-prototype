import type { Request } from "express";

export type UserRole = "Admin" | "Employee";
export type DeviceStatus = "Online" | "Offline" | "Quarantined";
export type Severity = "Low" | "Medium" | "High" | "Critical";
export type AlertStatus = "Open" | "Investigating" | "Blocked" | "Resolved";

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}
