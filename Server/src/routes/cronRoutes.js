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

    // Find the oldest draft and update it to publish
    const publishedBlog = await Blog.findOneAndUpdate(
      { status: "draft" },
      { $set: { status: "publish" } },
      { sort: { createdAt: 1 }, new: true }
    );

    // If no drafts found
    if (!publishedBlog) {
      return res.status(200).json({ 
        success: true, 
        published: 0, 
        message: "No drafts found to publish" 
      });
    }

    return res.status(200).json({
      success: true,
      published: 1,
      blogId: publishedBlog._id,
      title: publishedBlog.title,
    });
  } catch (error) {
    console.error("Daily publish cron error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error during cron job" 
    });
  }
});

export default router;
