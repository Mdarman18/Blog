import { axiosInstance } from "./axiosInstance";

export const blogApi = {
  getBlogs: (params, config) =>
    axiosInstance.get("/api/blogs", { params, ...config }),
  getMyPosts: () => axiosInstance.get("/api/admin/blogs"),
  getBlog: (id) => axiosInstance.get(`/api/blogs/${id}`),
  createBlog: (data) => axiosInstance.post("/api/blogs/create", data),
  updateBlog: (id, data) => axiosInstance.put(`/api/blogs/${id}`, data),
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
