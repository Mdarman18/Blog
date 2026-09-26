import { Router } from "express";
import authRoutes from "./authRoutes.js";

const router = Router();

// ── Health check ──────────────────────────────────────────────────────────────
router.get("/health", (_req, res) => {
  res.json({ success: true, message: "API is healthy 🟢" });
});

// ── Auth ──────────────────────────────────────────────────────────────────────
router.use("/auth", authRoutes);



export default router;
