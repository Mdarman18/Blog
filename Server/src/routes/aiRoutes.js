import { Router } from "express";
import { generateBlogContent } from "../controllers/aiController.js";
import { protect } from "../middlewares/auth.js";
import rateLimit from "express-rate-limit";

const router = Router();

// Rate limiter: max 5 requests per 15 minutes per IP
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: {
    success: false,
    message: "Too many AI generation requests from this IP, please try again after 15 minutes",
  },
});

router.post("/generate", protect, aiLimiter, generateBlogContent);

export default router;
