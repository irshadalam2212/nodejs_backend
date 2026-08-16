import { Router } from "express";
import { validate } from "../../middleware/validate";
import { loginSchema, registerSchema } from "./auth.validation";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resetPasswordController,
} from "./auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

export default router;
