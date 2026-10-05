import mongoose from "mongoose";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import * as blogService from "../services/blogService.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/uploadToCloudinary.js";

export const createBlog = catchAsync(async (req, res) => {
  const blogData = {
    ...req.body,
    author: req.user.id,
  };

  delete blogData.images;
  delete blogData.image;

  blogData.images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);
      blogData.images.push({ url: result.secure_url, publicId: result.public_id });
    }
  }

  const blog = await blogService.createBlog(blogData);

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    data: { blog },
  });
});

export const getAllBlogs = catchAsync(async (req, res) => {
  const filter = blogService.buildPublicBlogFilter(req.query);

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

export const getBlogById = catchAsync(async (req, res, next) => {
  const blog = await blogService.getBlogById(req.params.id);

  if (!blog) {
    return next(new AppError("Blog not found", 404));
  }

  if (blog.status !== "publish") {
    let canView = false;
    if (req.user) {
      if (
        req.user.role === "admin" ||
        blog.author._id.toString() === req.user.id.toString()
      ) {
        canView = true;
      }
    }

    if (!canView) {
      return next(new AppError("Blog not found", 404));
    }
  }

  res.status(200).json({
    success: true,
    data: { blog },
  });
});

export const updateBlog = catchAsync(async (req, res, next) => {
  const existingBlog = await blogService.getBlogById(req.params.id);

  if (!existingBlog) {
    return next(new AppError("Blog not found", 404));
  }

  const isAuthor = existingBlog.author._id.toString() === req.user.id;
  const isAdmin = req.user.role === "admin";
  if (!isAuthor && !isAdmin) {
    return next(
      new AppError("You are not authorized to update this blog", 403),
    );
  }

  const updateData = { ...req.body };
  
  // Prevent Mongoose CastError: Do not allow raw req.body.images to be saved directly
  delete updateData.images;
  delete updateData.image;

  if (req.files && req.files.length > 0) {
    const newImages = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);
      newImages.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }
    updateData.images = newImages;

    // Delete old images
    if (Array.isArray(existingBlog.images)) {
      for (const image of existingBlog.images) {
        if (image?.publicId) {
          try {
            await deleteFromCloudinary(image.publicId);
          } catch (error) {
            console.error("Failed to delete old image from Cloudinary:", error);
          }
        }
      }
    }
    
    // Backward compatibility for old blogs
    if (existingBlog.image && existingBlog.image.publicId) {
      try {
        await deleteFromCloudinary(existingBlog.image.publicId);
      } catch (error) {
        console.error("Failed to delete old image from Cloudinary:", error);
      }
    }
  }

  const blog = await blogService.updateBlog(req.params.id, updateData);

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    data: { blog },
  });
});

export const deleteBlog = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError("Invalid blog ID", 400));
  }

  const existingBlog = await blogService.getBlogById(req.params.id);

  if (!existingBlog) {
    return next(new AppError("Blog not found", 404));
  }

  const authorId = existingBlog.author?._id?.toString() || existingBlog.author?.toString();
  const userId = req.user._id?.toString() || req.user.id?.toString();

  const isAuthor = authorId && userId && authorId === userId;
  const isAdmin = req.user.role === "admin";

  if (!isAuthor && !isAdmin) {
    return next(
      new AppError("You are not authorized to delete this blog", 403),
    );
  }

  if (Array.isArray(existingBlog.images)) {
    for (const image of existingBlog.images) {
      if (image?.publicId) {
        try {
          await deleteFromCloudinary(image.publicId);
        } catch (error) {
          console.error("Failed to delete image from Cloudinary:", error);
        }
      }
    }
  }

  // Backward compatibility for old blogs
  if (existingBlog.image?.publicId) {
    try {
      await deleteFromCloudinary(existingBlog.image.publicId);
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error);
    }
  }

  await blogService.deleteBlog(existingBlog._id);

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
    data: null,
  });
});

export const getAllBlogsDirectController = catchAsync(async (req, res) => {
  const blogs = await blogService.getAllBlogsDirect();

  res.status(200).json({
    success: true,
    results: blogs.length,
    data: { blogs },
  });
});
export const getMyPosts = catchAsync(async (req, res) => {
  const blogs = await blogService.getBlogsByAuthor(req.user._id);

  res.status(200).json({
    success: true,
    results: blogs.length,
    data: { blogs },
  });
});
