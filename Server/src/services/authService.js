import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

const signToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

// timing-safe compare
const isValidAdminKey = (input) => {
  if (!env.ADMIN_SECRET_KEY || typeof input !== "string") return false;

  const a = Buffer.from(input);
  const b = Buffer.from(env.ADMIN_SECRET_KEY);

  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

export const registerUser = async ({
  name,
  email,
  password,
  role,
  adminKey,
}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }

  // default author, admin sirf sahi key pe
  let finalRole = "author";

  if (role === "admin") {
    if (!isValidAdminKey(adminKey)) {
      throw new AppError("Invalid admin key", 403);
    }
    finalRole = "admin";
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role: finalRole,
  });

  const token = signToken(newUser._id);

  return { user: newUser, token };
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Incorrect email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Incorrect email or password", 401);
  }

  const token = signToken(user._id);

  return { user, token };
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};
