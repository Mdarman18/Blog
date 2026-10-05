import { Router } from "express";

import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getMyPosts,
} from "../controllers/blogController.js";

import { protect, optionalAuth, authorize } from "../middlewares/auth.js";

// FIX: update ke liye naya optional validator bhi import karo
import {
  blogValidation,
  updateBlogValidation,
} from "../validators/blog_validation.js";
import { validate } from "../middlewares/validate.js";
import { getAllBlogsDirectController } from "../controllers/blogController.js";

// CHANGED: image upload (multer) + tags parser
import upload, { parseTags } from "../middlewares/upload.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management endpoints
 */
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

// FIX: /:id se pehle hona zaroori hai, warna "my-posts" ko id samajh lega
// (agar ye route kisi aur file me already register hai to ye 1 line hata dena)
router.get("/my-posts", protect, getMyPosts);

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
router.get("/:id", getBlogById);

/**
 * @swagger
 * /api/blogs/create:
 *   post:
 *     summary: Create a new blog with optional image (Admin only)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *                 type: string
 *                 description: JSON array string ya comma separated values
 *                 example: '["react","node"]'
 *               conclusion:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, publish]
 *                 default: draft
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Blog images (max 5 images, up to 5MB each, only image files)
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
// CHANGED: upload.array("images", 5) + parseTags add kiye (order important hai)
router.post(
  "/create",
  protect,
  upload.array("images", 5),
  parseTags,
  blogValidation,
  validate,
  createBlog,
);

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update a blog, optionally replace image (Admin only)
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: string
 *                 description: JSON array string ya comma separated values
 *                 example: '["react","node"]'
 *               conclusion:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, publish]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Nayi images (purani Cloudinary se delete ho jayegi)
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
  // CHANGED: image + tags parsing add ki
  upload.array("images", 5),
  parseTags,
  // FIX: update pe koi field required nahi, isliye blogValidation ki jagah ye
  updateBlogValidation,
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
router.delete("/:id", protect, authorize("admin", "You can not delete this. Only admin can delete."), deleteBlog);
export default router;
