import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import * as blogService from "../services/blogService.js";

export const createBlog = catchAsync(async (req, res) => {
  const blogData = {
    ...req.body,
    author: req.user.id,
  };

  const blog = await blogService.createBlog(blogData);

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    data: { blog },
  });
});

export const getAllBlogs = catchAsync(async (req, res) => {
  const filter = blogService.buildPublicBlogFilter(req.query);
  console.log(filter);
  
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

  if (existingBlog.author._id.toString() !== req.user.id) {
    return next(
      new AppError("You are not authorized to update this blog", 403),
    );
  }

  const blog = await blogService.updateBlog(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    data: { blog },
  });
});

export const deleteBlog = catchAsync(async (req, res, next) => {
  const existingBlog = await blogService.getBlogById(req.params.id);

  if (!existingBlog) {
    return next(new AppError("Blog not found", 404));
  }

  if (existingBlog.author._id.toString() !== req.user.id) {
    return next(
      new AppError("You are not authorized to delete this blog", 403),
    );
  }

  await blogService.deleteBlog(req.params.id);

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
