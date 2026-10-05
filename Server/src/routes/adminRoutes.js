import { Router } from "express";
import {
  getAllAdminBlogs,
  getDashboardStats,
  toggleBlogStatus,
} from "../controllers/adminBlogController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = Router();

router.use(protect);
router.use(authorize(["admin", "author"]));

router.get("/blogs", getAllAdminBlogs);
router.get("/stats", getDashboardStats);
router.patch("/blogs/:id/status", toggleBlogStatus);
export default router;
