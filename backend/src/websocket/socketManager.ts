import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "../config/env";

let io: Server | null = null;

export function initializeSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  // TODO: Replace simulation with real endpoint agents
  // TODO: integrate endpoint agents
  // TODO: integrate real-time telemetry ingestion
  setInterval(() => {
    if (!io) return;
    const timestamp = new Date().toISOString();
    io.emit("newAlert", { id: "simulation", type: "Simulated alert event", timestamp });
    io.emit("deviceUpdated", { deviceId: "simulation", status: "Online", timestamp });
    io.emit("riskChanged", { deviceId: "simulation", risk: Math.floor(Math.random() * 100), timestamp });
  }, 30000);

  return io;
}

export function emitNewAlert(payload: unknown) {
  io?.emit("newAlert", payload);
}

export function emitDeviceUpdated(payload: unknown) {
  io?.emit("deviceUpdated", payload);
}

export function emitRiskChanged(payload: unknown) {
  io?.emit("riskChanged", payload);
}
