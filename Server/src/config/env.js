import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
};
console.log(env);
