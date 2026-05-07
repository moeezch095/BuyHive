import express from "express";
import {
  registerController,
  loginController,
} from "../controllers/user.controller.js";
import {
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/user.controller.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validations/user.validation.js";
import { validate } from "../middlewares/validate.js";
import { logoutController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
console.log("routes ");

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPasswordController,
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPasswordController,
);

router.post("/logout", authMiddleware, logoutController);

export default router;
