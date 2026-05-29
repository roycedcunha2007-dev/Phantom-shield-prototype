import mongoose from "mongoose";
import { env } from "../config/env";
import { Alert } from "../models/Alert";
import { Device } from "../models/Device";
import { Recommendation } from "../models/Recommendation";
import { User } from "../models/User";

async function seed() {
  await mongoose.connect(env.mongodbUri);

  await Promise.all([
    User.deleteMany({}),
    Device.deleteMany({}),
    Alert.deleteMany({}),
    Recommendation.deleteMany({}),
  ]);

  await User.create([
    { name: "Admin Operator", email: "admin@phantomshield.local", password: "Password123!", role: "Admin" },
    { name: "Maya Singh", email: "maya@phantomshield.local", password: "Password123!", role: "Employee" },
  ]);

  const devices = await Device.create([
    { name: "Finance-Laptop-07", owner: "Maya Singh", type: "Windows endpoint", status: "Online", risk: 72, lastActivity: "2 min ago" },
    { name: "Ops-Tablet-03", owner: "Arjun Mehta", type: "iPadOS mobile", status: "Online", risk: 31, lastActivity: "6 min ago" },
    { name: "Sales-MacBook-11", owner: "Neha Kapoor", type: "macOS endpoint", status: "Online", risk: 48, lastActivity: "1 min ago" },
    { name: "Warehouse-PC-02", owner: "Shared kiosk", type: "Windows kiosk", status: "Quarantined", risk: 91, lastActivity: "11 min ago" },
  ]);

  const byName = Object.fromEntries(devices.map((device) => [device.name, device]));

  await Alert.create([
    {
      type: "Data exfiltration pattern",
      severity: "Critical",
      timestamp: "09:42",
      status: "Investigating",
      deviceId: byName["Finance-Laptop-07"]._id,
      ipAddress: "103.214.67.18",
      openedTabs: ["Billing archive", "Payroll export", "External cloud storage"],
      suspiciousBehaviors: ["Copied 1.8 GB of files in 7 minutes", "Accessed payroll records outside normal hours", "Attempted upload to an unapproved destination"],
      highAlertReason: "Large-volume sensitive data movement matched an exfiltration pattern and crossed the critical policy threshold.",
    },
    {
      type: "Privilege escalation attempt",
      severity: "High",
      timestamp: "09:29",
      status: "Blocked",
      deviceId: byName["Warehouse-PC-02"]._id,
      ipAddress: "10.24.18.42",
      openedTabs: ["Local admin console", "PowerShell history", "System settings"],
      suspiciousBehaviors: ["Unexpected script launched", "Privilege escalation command detected", "Device attempted lateral access after the script ran"],
      highAlertReason: "The device attempted elevated execution and was automatically quarantined to prevent spread.",
    },
    {
      type: "Impossible travel login",
      severity: "Medium",
      timestamp: "08:57",
      status: "Investigating",
      deviceId: byName["Sales-MacBook-11"]._id,
      ipAddress: "185.72.91.204",
      openedTabs: ["CRM dashboard", "Lead export", "Account settings"],
      suspiciousBehaviors: ["Login location changed too quickly to be physically possible", "Session opened after a recent login from another region", "MFA challenge was delayed"],
      highAlertReason: "The account showed a location anomaly consistent with possible credential misuse.",
    },
  ]);

  await Recommendation.create([
    { title: "Tighten finance data movement policy", severity: "High", explanation: "Finance-Laptop-07 copied a high-volume billing archive outside the normal accounting window.", action: "Apply DLP rule", applied: false },
    { title: "Require step-up verification for CRM sessions", severity: "Medium", explanation: "The sales account had a login pattern consistent with impossible travel within a short interval.", action: "Enforce MFA", applied: false },
    { title: "Keep kiosk endpoints in restricted mode", severity: "Critical", explanation: "Warehouse-PC-02 attempted elevated script execution and is already isolated from production systems.", action: "Extend quarantine", applied: false },
  ]);

  console.log("Seed data inserted");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error("Seed failed", error);
  await mongoose.disconnect();
  process.exit(1);
});
