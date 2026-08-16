import prisma from "../../config/prisma";
import { AppError } from "../../errors/AppError";
import { USER_ROLE } from "../../types/types";
import { createUser } from "../user/user.service";
import bcrypt from "bcrypt";
import { RegisterInput, loginInput } from "./auth.types";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

//find user by email
export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

//find user by id
export const findUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

//delete refresh token
export const deleteRefreshToken = async (token: string) => {
  return await prisma.refreshToken.delete({
    where: {
      token,
    },
  });
};

//find refresh token
export const findRefreshToken = async (token: string) => {
  return prisma.refreshToken.findUnique({
    where: {
      token,
    },
  });
};

// save refresh tokenin refreshToken table
export const saveRefreshToken = async (
  token: string,
  userId: number,
  expiresAt: Date,
) => {
  return prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
};

//register service
export const register = async (data: RegisterInput) => {
  //check existing user
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new AppError(409, "Email already exists.");
  }

  //hash the password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  //createUser
  const user = await createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: USER_ROLE.USER,
  });

  return user;
};

//login service
export const login = async (data: loginInput) => {
  //find user
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  //compare password
  const isPasswordMatch = await bcrypt.compare(data.password, user.password);

  if (!isPasswordMatch) {
    throw new AppError(401, "Invalid email or password");
  }

  //generate token
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  //refresh token
  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  await saveRefreshToken(
    refreshToken,
    user.id,
    new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  );

  //return response
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

//refreshToken service
export const refreshAccessToken = async (refreshToken: string) => {
  // Verify JWT
  const decoded = verifyRefreshToken(refreshToken);

  // Check DB
  const storedToken = await findRefreshToken(refreshToken);

  if (!storedToken) {
    throw new AppError(401, "Invalid refresh token");
  }

  // Find User
  const user = await findUserById(decoded.userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  // Generate New Access Token
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const newRefreshToken = generateRefreshToken({
    userId: user.id,
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.$transaction([
    prisma.refreshToken.delete({
      where: {
        id: storedToken.id,
      },
    }),

    prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt,
      },
    }),
  ]);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};
