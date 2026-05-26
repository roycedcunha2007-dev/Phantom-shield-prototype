export type Role = "Employee" | "Admin";
export type DeviceStatus = "Online" | "Quarantined";
export type Severity = "Low" | "Medium" | "High" | "Critical";
export type AlertStatus = "Open" | "Investigating" | "Blocked" | "Resolved";

export interface User {
  name: string;
  device: string;
  role: Role;
}

export interface DeviceLog {
  time: string;
  title: string;
  detail: string;
  suspicious: boolean;
}

export interface Device {
  id: string;
  name: string;
  owner: string;
  type: string;
  status: DeviceStatus;
  risk: number;
  lastActivity: string;
  logs: DeviceLog[];
}

export interface Alert {
  id: string;
  type: string;
  severity: Severity;
  timestamp: string;
  status: AlertStatus;
  deviceId: string;
  ipAddress: string;
  openedTabs: string[];
  suspiciousBehaviors: string[];
  highAlertReason: string;
}

export interface Recommendation {
  id: string;
  title: string;
  severity: Severity;
  explanation: string;
  action: string;
  applied: boolean;
}

export interface ActivityFeedItem {
  title: string;
  time: string;
  body: string;
}
