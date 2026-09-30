import { catchAsync } from "../utils/catchAsync.js";
import * as authService from "../services/authService.js";

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

export const register = catchAsync(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);

  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

export const login = catchAsync(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

export const logout = catchAsync(async (_req, res) => {
  res.clearCookie("token", clearCookieOptions);

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export const getMe = catchAsync(async (req, res) => {
  if (!req.user) {
    return res.status(200).json({
      success: false,
      message: "Not authenticated",
    });
  }

  const user = await authService.getUserById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});
