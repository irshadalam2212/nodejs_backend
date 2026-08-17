import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validate = (
  schema: ZodSchema,
  source: "body" | "query" | "params" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    
    res.locals.validated = {
      ...(res.locals.validated || {}),
      [source]: result.data,
    };

    next();
  };
};
