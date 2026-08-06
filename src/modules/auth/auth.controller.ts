import { Request, Response } from "express";
import { register } from "./auth.service";

export const registerController = async (req: Request, res: Response) => {
  const user = await register(req.body);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
};
