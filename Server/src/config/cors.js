import { env } from "./env.js";

export const corsOptions = {
  origin: ["http://localhost:5173", "https://blog-ppwc.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};
