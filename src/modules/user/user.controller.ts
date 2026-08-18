import { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserRole,
} from "./user.service";
import { AppError } from "../../errors/AppError";
import { uploadBufferToCloudinary } from "../../services/cloudinary.services";
import prisma from "../../config/prisma";

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

  // 1. Detect actual file type
  const { fileTypeFromBuffer } = await import("file-type");

  const detectedType = await fileTypeFromBuffer(req.file.buffer);

  if (!detectedType) {
    throw new AppError(400, "Unable to determine file type");
  }

  // 2. Allowed types
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(detectedType.mime)) {
    throw new AppError(400, "Unsupported file type");
  }

  // 3. Compare declared MIME with actual MIME
  if (detectedType.mime !== req.file.mimetype) {
    throw new AppError(400, "File type does not match its contents");
  }

  // 4. Upload to Cloudinary
  const result = await uploadBufferToCloudinary(
    req.file.buffer,
    "complete-nodejs/profile-images",
  );

  // 5. Update database
  const user = await prisma.user.update({
    where: {
      id: req?.user?.userId,
    },
    data: {
      profileImageUrl: result.secure_url,
      profileImagePublicId: result.public_id,
    },
    select: {
      id: true,
      email: true,
      profileImageUrl: true,
      profileImagePublicId: true,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Profile image uploaded successfully",
    data: {
      user,
    },
  });
};
