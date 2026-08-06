import { user_role } from "@prisma/client";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: user_role;
}
