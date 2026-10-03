import { Router } from "express";
import authRoutes from "./authRoutes.js";
import adminRoutes from "./adminRoutes.js";
import blogRoutes from "./blogRoutes.js";
import aiRoutes from "./aiRoutes.js";
const router = Router();

// ── Health check ──────────────────────────────────────────────────────────────
router.get("/health", (_req, res) => {
  res.json({ success: true, message: "API is healthy 🟢" });
});

// ── Auth ──────────────────────────────────────────────────────────────────────
router.use("/auth", authRoutes);
// ── Admin ─────────────────────────────────────────────────────────────────────
router.use("/admin", adminRoutes);

// ── Blogs ─────────────────────────────────────────────────────────────────────
router.use("/blogs", blogRoutes);

// ── AI ────────────────────────────────────────────────────────────────────────
router.use("/ai", aiRoutes);

export default router;
