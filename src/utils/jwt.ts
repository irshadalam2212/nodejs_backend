import { user_role } from "@prisma/client";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  email: string;
  role: user_role;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  const secret: Secret = process.env.JWT_SECRET!;

  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
};
