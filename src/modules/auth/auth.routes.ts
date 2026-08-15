import { Router } from "express";
import { validate } from "../../middleware/validate";
import { loginSchema, registerSchema } from "./auth.validation";
import {
  loginController,
  refreshTokenController,
  registerController,
} from "./auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.post("/refresh-token", refreshTokenController);

export default router;
