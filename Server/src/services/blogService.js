import mongoose from "mongoose";

import Blog from "../models/blog.js";
import User from "../models/user.js";

export const buildPublicBlogFilter = ({ search, tag } = {}) => {
  const filter = { status: "publish" };
  const searchTerm = typeof search === "string" ? search.trim() : "";
  const tagTerm = typeof tag === "string" ? tag.trim().toLowerCase() : "";

  if (searchTerm) {
    filter.$or = [
      { title: { $regex: searchTerm, $options: "i" } },
      { content: { $regex: searchTerm, $options: "i" } },
      { tags: { $regex: searchTerm, $options: "i" } },
    ];
  }

  if (tagTerm) {
    filter.tags = { $in: [tagTerm] };
  }


  return filter;
};

export const buildAdminBlogFilter = ({ search, tag, status } = {}) => {
  const filter = {};
  const searchTerm = typeof search === "string" ? search.trim() : "";
  const tagTerm = typeof tag === "string" ? tag.trim().toLowerCase() : "";

  if (searchTerm) {
    filter.$or = [
      { title: { $regex: searchTerm, $options: "i" } },
      { content: { $regex: searchTerm, $options: "i" } },
      { tags: { $regex: searchTerm, $options: "i" } },
    ];
  }

  if (tagTerm) {
    filter.tags = { $in: [tagTerm] };
  }

  if (status === "draft" || status === "published") {
    filter.status = status;
  }

  return filter;
};

export const createBlog = async (blogData) => {
  return await Blog.create(blogData);
};

export const getAllBlogs = async (filter, { page, limit } = {}) => {
  const pageNum = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
  const limitNum = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
  const skip = (pageNum - 1) * limitNum;

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Blog.countDocuments(filter),
  ]);

  return {
    blogs,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

export const getBlogById = async (id) => {
  if (!id || id === "all" || !mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Blog.findById(id).populate("author", "name email");
};

export const updateBlog = async (id, updateData) => {
  return await Blog.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteBlog = async (id) => {
  return await Blog.findByIdAndDelete(id);
};

export const buildDashboardStatsPayload = (blogStats) => ({
  blogs: {
    total: blogStats.total ?? 0,
    published: blogStats.published ?? 0,
    draft: blogStats.draft ?? 0,
  },
});

export const getDashboardStats = async (userId) => {
  const [totalBlogs, publishedBlogs, draftBlogs] = await Promise.all([
    Blog.countDocuments({ author: userId }),
    Blog.countDocuments({ author: userId, status: "publish" }),
    Blog.countDocuments({ author: userId, status: "draft" }),
  ]);

  return buildDashboardStatsPayload({
    total: totalBlogs,
    published: publishedBlogs,
    draft: draftBlogs,
  });
};
export const getAllBlogsDirect = async () => {
  return await Blog.find().populate("author", "name").sort({ createdAt: -1 });
};
