import { Alert } from "../models/Alert";
import { Device } from "../models/Device";
import { parsePagination } from "../utils/pagination";

export async function listAlerts(page?: string, limit?: string) {
  const pagination = parsePagination(page, limit);
  const [items, total] = await Promise.all([
    Alert.find().populate("deviceId").sort({ _id: -1 }).skip(pagination.skip).limit(pagination.limit),
    Alert.countDocuments(),
  ]);
  return { items, pagination: { page: pagination.page, limit: pagination.limit, total, pages: Math.ceil(total / pagination.limit) } };
}

export async function getAlertById(id: string) {
  const alert = await Alert.findById(id).populate("deviceId");
  if (!alert) {
    const error = new Error("Alert not found") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }
  return alert;
}

export async function createAlert(input: Record<string, unknown>) {
  return Alert.create(input);
}

export async function updateAlert(id: string, input: Record<string, unknown>) {
  const alert = await Alert.findByIdAndUpdate(id, input, { new: true, runValidators: true });
  if (!alert) {
    const error = new Error("Alert not found") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }
  return alert;
}

export async function deleteAlert(id: string) {
  const alert = await Alert.findByIdAndDelete(id);
  if (!alert) {
    const error = new Error("Alert not found") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }
  return alert;
}

export async function blockAlert(id: string) {
  const alert = await Alert.findByIdAndUpdate(id, { status: "Blocked" }, { new: true, runValidators: true });
  if (!alert) {
    const error = new Error("Alert not found") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }
  await Device.findByIdAndUpdate(alert.deviceId, { status: "Quarantined", $inc: { risk: -16 } }, { runValidators: true });
  return alert;
}

export async function unblockAlert(id: string) {
  const alert = await Alert.findByIdAndUpdate(id, { status: "Investigating" }, { new: true, runValidators: true });
  if (!alert) {
    const error = new Error("Alert not found") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }
  await Device.findByIdAndUpdate(alert.deviceId, { status: "Online", $inc: { risk: 10 } }, { runValidators: true });
  return alert;
}
