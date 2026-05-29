import { Router } from "express";
import { authRoutes } from "./authRoutes";
import { deviceRoutes } from "./deviceRoutes";
import { alertRoutes } from "./alertRoutes";
import { recommendationRoutes } from "./recommendationRoutes";

export const apiRoutes = Router();

apiRoutes.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", service: "phantom-shield-backend" } });
});

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/devices", deviceRoutes);
apiRoutes.use("/alerts", alertRoutes);
apiRoutes.use("/recommendations", recommendationRoutes);
