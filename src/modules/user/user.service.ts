import { user_role } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../errors/AppError";
import { CreateUserInput } from "./user.interface";
import { GetUsersInput } from "../../validators/pagination.schema";

export const createUser = async (data: CreateUserInput) => {
  return await prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const getAllUsers = async (params: GetUsersInput) => {

  const { page, limit, role, search, sortBy, sortOrder } = params;
  
  const skip = (page - 1) * limit;
  const where = {
    ...(role && {
      role,
    }),

    ...(search && {
      OR: [
        {
          name: {
            contains: search,
          },
        },
        {
          email: {
            contains: search,
          },
        },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
};

export const updateUserRole = async (id: number, role: "USER" | "ADMIN") => {
  return prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteUser = async (id: number) => {
  const user = await prisma.user.delete({
    where: { id },
    select: {
      id: true,
    },
  });
  return user;
};
