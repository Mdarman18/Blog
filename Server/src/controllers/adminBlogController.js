import Blog from "../models/blog.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import * as blogService from "../services/blogService.js";

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin endpoints for managing blogs
 */
/**
 * @swagger
 * /api/admin/blogs:
 *   get:
 *     summary: Get blogs belonging to the logged-in user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by keyword
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, publish]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of blogs belonging to the authenticated user
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
export const getAllAdminBlogs = catchAsync(async (req, res) => {
  const filter = {
    ...blogService.buildAdminBlogFilter(req.query),
    author: req.user._id,
  };
  const { page, limit } = req.query;
  const { blogs, pagination } = await blogService.getAllBlogs(filter, {
    page,
    limit,
  });

  res.status(200).json({
    success: true,
    results: blogs.length,
    pagination,
    data: { blogs },
  });
});

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics for the logged-in user (own posts only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics for the authenticated user's own blogs
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
export const getDashboardStats = catchAsync(async (req, res) => {
  const stats = await blogService.getDashboardStats(req.user._id);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

/**
 * @swagger
 * /api/admin/blogs/{id}/status:
 *   patch:
 *     summary: Toggle a blog's status between draft and publish
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog id
 *     responses:
 *       200:
 *         description: Blog status updated
 *       404:
 *         description: Blog not found
 */
export const toggleBlogStatus = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new AppError("Blog not found", 404));
  }

  blog.status = blog.status === "draft" ? "publish" : "draft";
  await blog.save();

  res.status(200).json({
    success: true,
    message: `Blog status updated to ${blog.status}`,
    data: {
      blog,
    },
  });
});

export const getBlogsByAuthor = async (authorId) => {
  return await Blog.find({ author: authorId })
    .populate("author", "name")
    .sort({ createdAt: -1 });
};

