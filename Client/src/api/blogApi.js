import { axiosInstance } from "./axiosInstance";

export const blogApi = {
  getBlogs: (params, config) =>
    axiosInstance.get("/api/blogs", { params, ...config }),
  getMyPosts: () => axiosInstance.get("/api/admin/blogs"),
  getBlog: (id) => axiosInstance.get(`/api/blogs/${id}`),
  createBlog: (data) => axiosInstance.post("/api/blogs/create", data),
  updateBlog: (id, data) => axiosInstance.put(`/api/blogs/${id}`, data),
  deleteBlog: (id) => axiosInstance.delete(`/api/blogs/${id}`),
};
