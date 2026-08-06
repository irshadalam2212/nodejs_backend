import { user_role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export const authorize =
  (...roles: user_role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    if (!roles.includes(req.user.role as user_role)) {
      throw new AppError(403, "Forbidden");
    }

    next();
  };
