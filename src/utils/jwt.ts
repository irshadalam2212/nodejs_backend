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

export const generateRefreshToken = (payload: { userId: number }) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as Secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as Secret) as {
    userId: number;
  };
};
