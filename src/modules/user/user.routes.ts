import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserRoleController,
} from "./user.controller";
import { validate } from "../../middleware/validate";
import { createUserSchema } from "./user.validation";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { user_role } from "@prisma/client";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize(user_role.ADMIN),
  getAllUsersController,
);
router.get(
  "/:id",
  authenticate,
  authorize(user_role.ADMIN),
  getUserByIdController,
);
router.post(
  "/",
  validate(createUserSchema),
  authenticate,
  authorize(user_role.ADMIN),
  createUserController,
);
router.patch(
  "/:id/role",
  authenticate,
  authorize(user_role.ADMIN),
  updateUserRoleController,
);
router.delete(
  "/:id",
  authenticate,
  authorize(user_role.ADMIN),
  deleteUserController,
);

export default router;
