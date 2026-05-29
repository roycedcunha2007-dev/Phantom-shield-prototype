import { Router } from "express";
import { login, logout, profile, register } from "../controllers/authController";
import { auth } from "../middleware/auth";
import { authRateLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { loginValidators, registerValidators } from "../middleware/validators";

export const authRoutes = Router();

authRoutes.post("/register", authRateLimiter, registerValidators, validate, register);
authRoutes.post("/login", authRateLimiter, loginValidators, validate, login);
authRoutes.get("/profile", auth, profile);
authRoutes.post("/logout", auth, logout);
