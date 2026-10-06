import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    content: {
      type: String,
      required: [true, "Content is required"],
    },

    // Multiple images
    images: [
      {
        url: {
          type: String,
          default: "",
        },
        publicId: {
          type: String,
          default: "",
        },
      },
    ],

    tags: {
      type: [String],
      default: [],
      set: (tags) => tags.map((tag) => tag.trim().toLowerCase()),
    },

    conclusion: {
      type: String,
      required: [true, "Conclusion is required"],
    },

    status: {
      type: String,
      enum: ["draft", "scheduled", "publish"],
      default: "draft",
      required: true,
    },

    scheduledAt: {
      type: Date,
      default: null,
    },

    timezone: {
      type: String,
      default: null,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Text index for search
blogSchema.index({
  title: "text",
  content: "text",
  tags: "text",
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;