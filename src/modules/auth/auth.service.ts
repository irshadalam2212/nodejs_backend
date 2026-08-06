import prisma from "../../config/prisma";
import { AppError } from "../../errors/AppError";
import { USER_ROLE } from "../../types/types";
import { createUser } from "../user/user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegisterInput, loginInput } from "./auth.types";
import { generateAccessToken } from "../../utils/jwt";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

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

  //return response
  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
