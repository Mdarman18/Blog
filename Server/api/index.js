import app from "../app.js";
import { connectDB } from "../src/config/db.js";

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Request failed before Express handling:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
