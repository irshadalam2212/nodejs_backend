import { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserRole,
} from "./user.service";

export const createUserController = async (req: Request, res: Response) => {
  const user = await createUser(req.body);

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
};

export const getAllUsersController = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await getAllUsers(page, limit);

  return res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    data: result.users,
    pagination: result.pagination,
  });
};

export const getUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getUserById(Number(id));

  return res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
};

export const updateUserRoleController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { role } = req.body;

  const user = await updateUserRole(id, role);

  return res.status(200).json({
    success: true,
    message: "User role updated successfully.",
    data: user,
  });
};

export const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await deleteUser(Number(id));

  return res.status(200).json({
    status: true,
    message: "User deleted",
    data: user,
  });
};
