import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Prisma Known Errors
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      // Unique Constraint
      case "P2002":
        return res.status(409).json({
          success: false,
          message: "Resource already exists.",
        });

      // Record Not Found
      case "P2025":
        return res.status(404).json({
          success: false,
          message: "Resource not found.",
        });

      // Foreign Key Constraint
      case "P2003":
        return res.status(400).json({
          success: false,
          message: "Invalid reference.",
        });

      default:
        return res.status(400).json({
          success: false,
          message: err.message,
        });
    }
  }

  // Prisma Validation Error
  if (err instanceof PrismaClientValidationError) {
    console.error("Prisma Validation Error:", err);
    return res.status(400).json({
      success: false,
      // message: "Invalid request data.",
      message: err.message,
    });
  }

  // Unknown Error
  console.error("Unhandled Error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
