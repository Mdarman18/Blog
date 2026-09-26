import { Router } from "express";
import {
  getAllAdminBlogs,
  getDashboardStats,
  toggleBlogStatus,
} from "../controllers/adminBlogController.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.use(protect);

router.get("/blogs", getAllAdminBlogs);
router.get("/stats", getDashboardStats);
router.patch("/blogs/:id/status", toggleBlogStatus);

export default router;
