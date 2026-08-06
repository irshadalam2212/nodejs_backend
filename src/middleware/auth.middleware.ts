import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Get Authorization Header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(401, "Authorization header is missing.");
  }

  // 2. Check Bearer Token
  if (!authHeader.startsWith("Bearer ")) {
    throw new AppError(401, "Invalid authorization format.");
  }

  // 3. Extract Token
  const token = authHeader.split(" ")[1];

  // 4. Verify Token and attach user
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch {
    throw new AppError(401, "Invalid or expired access token.");
  }
};
