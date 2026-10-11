import { axiosInstance } from "./axiosInstance";

export const blogApi = {
  getBlogs: (params, config) =>
    axiosInstance.get("/api/blogs", { params, ...config }),
  getPopularBlogs: () => axiosInstance.get("/api/blogs/popular?limit=5"),
  getRecentBlogs: () => axiosInstance.get("/api/blogs/recent?limit=5"),
  getRelatedBlogs: (id) => axiosInstance.get(`/api/blogs/${id}/related`),
  getMyPosts: () => axiosInstance.get("/api/admin/blogs"),
  getBlog: (id) => axiosInstance.get(`/api/blogs/${id}`),
  createBlog: (data) => axiosInstance.post("/api/blogs/create", data),
  updateBlog: (id, data) => axiosInstance.put(`/api/blogs/${id}`, data),
  generateBlog: (title) => axiosInstance.post("/api/ai/generate", { title }),
  toggleLike: (id, data = {}) => axiosInstance.post(`/api/blogs/${id}/like`, data),
  incrementView: (id) => axiosInstance.patch(`/api/blogs/${id}/view`),
  getComments: (id) => axiosInstance.get(`/api/blogs/${id}/comments`),
  addComment: (id, commentData) => {
    const payload = typeof commentData === "string" ? { text: commentData } : commentData;
    return axiosInstance.post(`/api/blogs/${id}/comments`, payload);
  },
  deleteComment: (id, cId) => axiosInstance.delete(`/api/blogs/${id}/comments/${cId}`),
  deleteBlog: async (id) => {
    const url = `/api/blogs/${id}`;
    if (import.meta.env.DEV) console.debug("[blog delete request]", url);

    try {
      const response = await axiosInstance.delete(url);
      if (import.meta.env.DEV) {
        console.debug("[blog delete response]", {
          status: response.status,
          data: response.data,
        });
      }
      return response;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("[blog delete error]", {
          status: error.response?.status,
          data: error.response?.data,
        });
      }
      throw error;
    }
  },
};
