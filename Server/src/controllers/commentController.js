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
  const { text } = req.body;
  const userId = req.user.id;

  if (!text || text.trim() === "") {
    return next(new AppError("Comment text is required", 400));
  }

  const blog = await Blog.findById(id);
  if (!blog) return next(new AppError("Blog not found", 404));

  const comment = await Comment.create({
    blogId: id,
    userId,
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

  const isOwner = comment.userId.toString() === req.user.id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return next(new AppError("You are not authorized to delete this comment", 403));
  }

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});
