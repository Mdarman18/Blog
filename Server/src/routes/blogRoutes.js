import { Router } from "express";

import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getMyPosts,
} from "../controllers/blogController.js";

import { protect, optionalAuth } from "../middlewares/auth.js";

import { blogValidation } from "../validators/blog_validation.js";
import { validate } from "../middlewares/validate.js";
import { getAllBlogsDirectController } from "../controllers/blogController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management endpoints
 */
/**
 * @swagger
 * /api/blogs/my-posts:
 *   get:
 *     summary: Get all posts belonging to the logged-in user
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all posts belonging to the authenticated user
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.get("/my-posts", protect, getMyPosts);
/**
 * @swagger
 * /api/blogs/all:
 *   get:
 *     summary: Get all blogs directly (no filters, no pagination)
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of all blogs
 *       500:
 *         description: Internal server error
 */
router.get("/all", getAllBlogsDirectController);
/**
 * @swagger
 * /api/blogs?query:
 *   get:
 *     summary: Get all published blogs
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by keyword in title, content, or tags
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter blogs by a specific tag
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of published blogs
 *       400:
 *         description: Validation error or invalid pagination parameters
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllBlogs);

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get a single blog by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The blog object
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", optionalAuth, getBlogById);

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog (Admin only)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - conclusion
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               conclusion:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, publish]
 *                 default: draft
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.post("/create", protect, blogValidation, validate, createBlog);

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update a blog (Admin only)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               conclusion:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, publish]
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Blog not found
 */
router.put(
  "/:id",
  protect,

  blogValidation,
  validate,
  updateBlog,
);

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete a blog (Admin only)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Blog not found
 */
router.delete("/:id", protect, deleteBlog);
export default router;
