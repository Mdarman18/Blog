import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  const conn = await mongoose.connect(env.MONGO_URI);
  return conn;
}
