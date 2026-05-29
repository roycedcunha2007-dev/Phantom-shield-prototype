import { Router } from "express";
import { createDeviceHandler, deleteDeviceHandler, getDevice, getDevices, updateDeviceHandler } from "../controllers/deviceController";
import { auth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { deviceCreateValidators, deviceUpdateValidators, idValidator, paginationValidators } from "../middleware/validators";

export const deviceRoutes = Router();

deviceRoutes.use(auth);
deviceRoutes.get("/", paginationValidators, validate, getDevices);
deviceRoutes.get("/:id", idValidator, validate, getDevice);
deviceRoutes.post("/", deviceCreateValidators, validate, createDeviceHandler);
deviceRoutes.patch("/:id", deviceUpdateValidators, validate, updateDeviceHandler);
deviceRoutes.delete("/:id", idValidator, validate, deleteDeviceHandler);
