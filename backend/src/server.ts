import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { apiRateLimiter } from "./middleware/rateLimiter";
import { apiRoutes } from "./routes";
import { initializeSocket } from "./websocket/socketManager";

async function bootstrap() {
  await connectDatabase();

  const app = express();
  const server = http.createServer(app);

  app.use(helmet());
  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(mongoSanitize());
  app.use(apiRateLimiter);

  app.use("/api", apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  initializeSocket(server);

  server.listen(env.port, () => {
    console.log(`Phantom Shield backend running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start Phantom Shield backend", error);
  process.exit(1);
});
