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

const router = Router();

router.post("/", validate(createUserSchema), createUserController);
router.patch("/:id/role", updateUserRoleController);
router.delete("/:id", deleteUserController);
router.get("/", getAllUsersController);
router.get("/:id", getUserByIdController);

export default router;
