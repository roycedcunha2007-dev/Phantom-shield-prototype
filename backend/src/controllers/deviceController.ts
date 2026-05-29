import type { Request, Response, NextFunction } from "express";
import { createDevice, deleteDevice, getDeviceById, listDevices, updateDevice } from "../services/deviceService";
import { successResponse } from "../utils/apiResponse";

export async function getDevices(req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, await listDevices(req.query.page as string, req.query.limit as string));
  } catch (error) {
    return next(error);
  }
}

export async function getDevice(req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, await getDeviceById(req.params.id));
  } catch (error) {
    return next(error);
  }
}

export async function createDeviceHandler(req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, await createDevice(req.body), 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateDeviceHandler(req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, await updateDevice(req.params.id, req.body));
  } catch (error) {
    return next(error);
  }
}

export async function deleteDeviceHandler(req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, await deleteDevice(req.params.id));
  } catch (error) {
    return next(error);
  }
}
