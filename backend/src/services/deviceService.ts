import { Device } from "../models/Device";
import { parsePagination } from "../utils/pagination";

export async function listDevices(page?: string, limit?: string) {
  const pagination = parsePagination(page, limit);
  const [items, total] = await Promise.all([
    Device.find().sort({ updatedAt: -1 }).skip(pagination.skip).limit(pagination.limit),
    Device.countDocuments(),
  ]);
  return { items, pagination: { page: pagination.page, limit: pagination.limit, total, pages: Math.ceil(total / pagination.limit) } };
}

export async function getDeviceById(id: string) {
  const device = await Device.findById(id);
  if (!device) {
    const error = new Error("Device not found") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }
  return device;
}

export async function createDevice(input: Record<string, unknown>) {
  return Device.create(input);
}

export async function updateDevice(id: string, input: Record<string, unknown>) {
  const device = await Device.findByIdAndUpdate(id, input, { new: true, runValidators: true });
  if (!device) {
    const error = new Error("Device not found") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }
  return device;
}

export async function deleteDevice(id: string) {
  const device = await Device.findByIdAndDelete(id);
  if (!device) {
    const error = new Error("Device not found") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }
  return device;
}
