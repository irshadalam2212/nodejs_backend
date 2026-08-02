import { Request, Response } from "express";
import { createUser, getAllUsers, getUserById } from "./user.service";

export const createUserController = async (req: Request, res: Response) => {
  const user = await createUser(req.body);

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
};

export const getAllUsersController = async (req: Request, res: Response) => {
  const users = await getAllUsers();
  return res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    data: users,
  });
};

export const getUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getUserById(Number(id));
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
};
