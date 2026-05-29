import type { Request, Response, NextFunction } from "express";
import { blockAlert, createAlert, deleteAlert, getAlertById, listAlerts, unblockAlert, updateAlert } from "../services/alertService";
import { successResponse } from "../utils/apiResponse";

export async function getAlerts(req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, await listAlerts(req.query.page as string, req.query.limit as string));
  } catch (error) {
    return next(error);
  }
}

export async function getAlert(req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, await getAlertById(req.params.id));
  } catch (error) {
    return next(error);
  }
}

export async function createAlertHandler(req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, await createAlert(req.body), 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateAlertHandler(req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, await updateAlert(req.params.id, req.body));
  } catch (error) {
    return next(error);
  }
}

export async function deleteAlertHandler(req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, await deleteAlert(req.params.id));
  } catch (error) {
    return next(error);
  }
}

export async function blockAlertHandler(req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, await blockAlert(req.params.id));
  } catch (error) {
    return next(error);
  }
}

export async function unblockAlertHandler(req: Request, res: Response, next: NextFunction) {
  try {
    return successResponse(res, await unblockAlert(req.params.id));
  } catch (error) {
    return next(error);
  }
}
