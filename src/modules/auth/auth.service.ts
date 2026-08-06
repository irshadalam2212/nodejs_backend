import prisma from "../../config/prisma";
import { AppError } from "../../errors/AppError";
import { USER_ROLE } from "../../types/types";
import { createUser } from "../user/user.service";
import { RegisterInput } from "./auth.types";
import bcrypt from "bcrypt";

export const register = async (data: RegisterInput) => {
  //check existing user
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

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
