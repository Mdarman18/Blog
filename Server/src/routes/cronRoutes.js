import { Router } from "express";
import Blog from "../models/blog.js";

const router = Router();

router.post("/publish-daily", async (req, res) => {
  try {
    const authHeader = req.headers["x-cron-secret"];
    // Check if secret is configured and matches
    if (!process.env.CRON_SECRET || authHeader !== process.env.CRON_SECRET) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized cron request" 
      });
    }

    const now = new Date();
    // Find all scheduled blogs whose time has arrived and update them to publish
    const result = await Blog.updateMany(
      { status: "scheduled", scheduledAt: { $lte: now } },
      { $set: { status: "publish" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(200).json({ 
        success: true, 
        published: 0, 
        message: "No scheduled blogs found to publish at this time" 
      });
    }

    return res.status(200).json({
      success: true,
      published: result.modifiedCount,
      message: `Published ${result.modifiedCount} scheduled blogs`
    });
  } catch (error) {
    console.error("Schedule publish cron error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error during cron job" 
    });
  }
});

export default router;
