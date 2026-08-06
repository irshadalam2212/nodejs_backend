import { Router } from "express";
import { validate } from "../../middleware/validate";
import { registerSchema } from "./auth.validation";
import { registerController } from "./auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), registerController);

export default router;
