import { axiosInstance } from './axiosInstance';

export const adminApi = {
  getBlogs: (params, config) => axiosInstance.get('/api/admin/blogs', { params, ...config }),
  getStats: () => axiosInstance.get('/api/admin/stats'),
  toggleStatus: (id) => axiosInstance.patch(`/api/admin/blogs/${id}/status`),
};
