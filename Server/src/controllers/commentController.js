import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import Comment from "../models/comment.js";
import Blog from "../models/blog.js";

export const getComments = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const comments = await Comment.find({ blogId: id })
    .populate("userId", "name avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: { comments },
  });
});

export const addComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { text, guestName, guestEmail } = req.body;
  const userId = req.user?.id || null;

  if (!text || text.trim() === "") {
    return next(new AppError("Comment text is required", 400));
  }

  // Name and email are required
  const name = userId ? (req.user?.name || guestName) : guestName;
  const email = userId ? (req.user?.email || guestEmail) : guestEmail;

  if (!name || name.trim() === "") {
    return next(new AppError("Name is required to post a comment", 400));
  }

  if (!email || email.trim() === "") {
    return next(new AppError("Email is required to post a comment", 400));
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return next(new AppError("Please provide a valid email address", 400));
  }

  const blog = await Blog.findById(id);
  if (!blog) return next(new AppError("Blog not found", 404));

  const comment = await Comment.create({
    blogId: id,
    userId,
    guestName: name.trim(),
    guestEmail: email.trim().toLowerCase(),
    text: text.trim(),
  });

  const populatedComment = await comment.populate("userId", "name avatar");

  res.status(201).json({
    success: true,
    message: "Comment added successfully",
    data: { comment: populatedComment },
  });
});

export const deleteComment = catchAsync(async (req, res, next) => {
  const { cId } = req.params;
  
  const comment = await Comment.findById(cId);
  if (!comment) return next(new AppError("Comment not found", 404));

  const isOwner = comment.userId && req.user?.id && comment.userId.toString() === req.user.id.toString();
  const isAdmin = req.user?.role === "admin";

  if (!isOwner && !isAdmin) {
    return next(new AppError("You are not authorized to delete this comment", 403));
  }

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});
