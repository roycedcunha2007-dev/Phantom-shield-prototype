import { Router } from "express";
import { blockAlertHandler, createAlertHandler, deleteAlertHandler, getAlert, getAlerts, unblockAlertHandler, updateAlertHandler } from "../controllers/alertController";
import { auth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { alertCreateValidators, alertUpdateValidators, idValidator, paginationValidators } from "../middleware/validators";

export const alertRoutes = Router();

alertRoutes.use(auth);
alertRoutes.get("/", paginationValidators, validate, getAlerts);
alertRoutes.get("/:id", idValidator, validate, getAlert);
alertRoutes.post("/", alertCreateValidators, validate, createAlertHandler);
alertRoutes.patch("/:id", alertUpdateValidators, validate, updateAlertHandler);
alertRoutes.delete("/:id", idValidator, validate, deleteAlertHandler);
alertRoutes.patch("/:id/block", idValidator, validate, blockAlertHandler);
alertRoutes.patch("/:id/unblock", idValidator, validate, unblockAlertHandler);
