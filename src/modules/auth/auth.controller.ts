import { Request, Response } from "express";
import { login, logout, refreshAccessToken, register } from "./auth.service";

export const registerController = async (req: Request, res: Response) => {
  const user = await register(req.body);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
};

export const loginController = async (req: Request, res: Response) => {
  const result = await login(req.body);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const result = await refreshAccessToken(refreshToken);

  return res.status(200).json({
    success: true,
    message: "Access token refreshed successfully.",
    data: result,
  });
};

export const logoutController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const result = await logout(refreshToken);

  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};
