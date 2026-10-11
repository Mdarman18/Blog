import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blogs: [],
  popularBlogs: [],
  recentBlogs: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
    setPopularBlogs: (state, action) => {
      state.popularBlogs = action.payload;
    },
    setRecentBlogs: (state, action) => {
      state.recentBlogs = action.payload;
    },
    optimisticLike: (state, action) => {
      const { id, userId } = action.payload;
      const blog = state.blogs.find((b) => b._id === id || b.id === id);
      if (blog) {
        if (!blog.likes) blog.likes = [];
        const index = blog.likes.indexOf(userId);
        if (index === -1) {
          blog.likes.push(userId); // Add like
        } else {
          blog.likes.splice(index, 1); // Remove like
        }
      }
    },
    optimisticView: (state, action) => {
      const { id } = action.payload;
      const blog = state.blogs.find((b) => b._id === id || b.id === id);
      if (blog) {
        blog.views = (blog.views || 0) + 1;
      }
    },
  },
});

export const { setBlogs, setPopularBlogs, setRecentBlogs, optimisticLike, optimisticView } = blogSlice.actions;
export default blogSlice.reducer;
