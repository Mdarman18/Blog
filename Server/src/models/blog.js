import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        tags: {
            type: [String],
            default: [],
            set: (tags) => tags.map((tag) => tag.trim().toLowerCase()),
        },
        conclusion: {
            type: String,
            required: [true, 'Conclusion is required'],
        },
        status: {
            type: String,
            enum: ['draft', 'publish'],
            default: 'draft',
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true } // adds createdAt & updatedAt automatically
);

// Text index for search (title, content, tags)
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;