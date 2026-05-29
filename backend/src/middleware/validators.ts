import { body, param, query } from "express-validator";

const objectId = param("id").isMongoId().withMessage("Invalid resource id");

export const paginationValidators = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100"),
];

export const registerValidators = [
  body("name").trim().notEmpty().withMessage("name is required"),
  body("email").trim().isEmail().normalizeEmail().withMessage("valid email is required"),
  body("password").isLength({ min: 8 }).withMessage("password must be at least 8 characters"),
  body("role").isIn(["Admin", "Employee"]).withMessage("role must be Admin or Employee"),
];

export const loginValidators = [
  body("email").trim().isEmail().normalizeEmail().withMessage("valid email is required"),
  body("password").notEmpty().withMessage("password is required"),
];

export const deviceCreateValidators = [
  body("name").trim().notEmpty().withMessage("name is required"),
  body("owner").trim().notEmpty().withMessage("owner is required"),
  body("type").trim().notEmpty().withMessage("type is required"),
  body("status").optional().isIn(["Online", "Offline", "Quarantined"]),
  body("risk").optional().isFloat({ min: 0, max: 100 }),
  body("lastActivity").optional().trim().notEmpty(),
];

export const deviceUpdateValidators = [
  objectId,
  body("name").optional().trim().notEmpty(),
  body("owner").optional().trim().notEmpty(),
  body("type").optional().trim().notEmpty(),
  body("status").optional().isIn(["Online", "Offline", "Quarantined"]),
  body("risk").optional().isFloat({ min: 0, max: 100 }),
  body("lastActivity").optional().trim().notEmpty(),
];

export const alertCreateValidators = [
  body("type").trim().notEmpty().withMessage("type is required"),
  body("severity").isIn(["Low", "Medium", "High", "Critical"]),
  body("timestamp").trim().notEmpty().withMessage("timestamp is required"),
  body("status").optional().isIn(["Open", "Investigating", "Blocked", "Resolved"]),
  body("deviceId").isMongoId().withMessage("valid deviceId is required"),
  body("ipAddress").trim().notEmpty().withMessage("ipAddress is required"),
  body("openedTabs").optional().isArray(),
  body("suspiciousBehaviors").optional().isArray(),
  body("highAlertReason").trim().notEmpty().withMessage("highAlertReason is required"),
];

export const alertUpdateValidators = [
  objectId,
  body("type").optional().trim().notEmpty(),
  body("severity").optional().isIn(["Low", "Medium", "High", "Critical"]),
  body("timestamp").optional().trim().notEmpty(),
  body("status").optional().isIn(["Open", "Investigating", "Blocked", "Resolved"]),
  body("deviceId").optional().isMongoId(),
  body("ipAddress").optional().trim().notEmpty(),
  body("openedTabs").optional().isArray(),
  body("suspiciousBehaviors").optional().isArray(),
  body("highAlertReason").optional().trim().notEmpty(),
];

export const recommendationCreateValidators = [
  body("title").trim().notEmpty().withMessage("title is required"),
  body("severity").isIn(["Low", "Medium", "High", "Critical"]),
  body("explanation").trim().notEmpty().withMessage("explanation is required"),
  body("action").trim().notEmpty().withMessage("action is required"),
  body("applied").optional().isBoolean(),
];

export const idValidator = [objectId];
