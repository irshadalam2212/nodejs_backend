import { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserRole,
} from "./user.service";
import { AppError } from "../../errors/AppError";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const createUserController = async (req: Request, res: Response) => {
  const user = await createUser(req.body);

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
};

export const getAllUsersController = async (req: Request, res: Response) => {
  const query = res.locals.validated.query;

  const result = await getAllUsers(query);

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

export const uploadProfileImageController = async (
  req: Request,
  res: Response,
) => {
  if (!req.file) {
    throw new AppError(400, "File is required");
  }

  const { fileTypeFromBuffer } = await import("file-type");

  const detectedType = await fileTypeFromBuffer(req.file.buffer);

  if (!detectedType) {
    throw new AppError(400, "Unable to determine file type");
  }

  const extensionMap: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };

  const extension = extensionMap[detectedType.mime];

  if (!extension) {
    throw new AppError(400, "Unsupported file type");
  }

  if (detectedType.mime !== req.file.mimetype) {
    throw new AppError(400, "File type does not match its contents");
  }

  const uploadDir = path.join(process.cwd(), "uploads");

  await fs.mkdir(uploadDir, {
    recursive: true,
  });

  const filename = `${randomUUID()}${extension}`;

  const filePath = path.join(uploadDir, filename);

  await fs.writeFile(filePath, req.file.buffer);

  return res.status(200).json({
    success: true,
    message: "File uploaded successfully",
    data: {
      filename,
      path: `/uploads/${filename}`,
      size: req.file.size,
      mimetype: detectedType.mime,
    },
  });
};
