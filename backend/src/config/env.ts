import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/phantom-shield",
  jwtSecret: process.env.JWT_SECRET || "development-only-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV || "development",
};
