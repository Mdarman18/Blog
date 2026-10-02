import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  try {
    console.log("========== MongoDB DEBUG ==========");
    console.log("MongoDB URI exists:", Boolean(env.MONGO_URI));
    console.log("MongoDB URI length:", env.MONGO_URI?.length || 0);
    console.log("Mongoose state before:", mongoose.connection.readyState);

    if (!env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    // 1 = connected
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return mongoose.connection;
    }

    console.log("Attempting MongoDB connection...");

    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully");
    console.log("Host:", conn.connection.host);
    console.log("Database:", conn.connection.name);
    console.log("Mongoose state after:", mongoose.connection.readyState);
    console.log("===================================");

    return conn;
  } catch (error) {
    console.error("========== MongoDB ERROR ==========");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Reason:", error.reason);
    console.error("===================================");

    throw error;
  }
}
