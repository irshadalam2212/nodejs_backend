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

const router = Router();

router.get("/", authenticate, getAllUsersController);
router.get("/:id", authenticate, getUserByIdController);
router.post(
  "/",
  validate(createUserSchema),
  authenticate,
  createUserController,
);
router.patch("/:id/role", authenticate, updateUserRoleController);
router.delete("/:id", authenticate, deleteUserController);

export default router;
