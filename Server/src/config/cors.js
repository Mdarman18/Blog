import { env } from "./env.js";

export const corsOptions = {
  origin: [
    env.CLIENT_ORIGIN,
    "http://localhost:5173",
    "https://blog-1ya8.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};
