import { env } from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export async function protect(req, res, next) {
  const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  }

  try {
    if (!env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Token invalid or expired" });
  }
}

export async function optionalAuth(req, res, next) {
  const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

  if (!token) {
    return next();
  }

  try {
    if (!env.JWT_SECRET) {
      return next();
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user) {
      req.user = user;
    }
  } catch {
    // Ignore errors for optional auth
  }
  next();
}
