import { Request, Response } from "express";
import {
  forgotPassword,
  login,
  logout,
  refreshAccessToken,
  register,
  resetPassword,
} from "./auth.service";

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

  await logout(refreshToken);

  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;

  await forgotPassword(email);

  return res.status(200).json({
    success: true,
    message:
      "If an account exists with this email, a password reset link has been sent.",
  });
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  await resetPassword(token, password);
  return res.status(200).json({
    success: true,
    message: "Password reset successfully.",
  });
};
