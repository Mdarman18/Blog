import { axiosInstance } from './axiosInstance';

export const authApi = {
  register: (data) => axiosInstance.post('/api/auth/register', data),
  login: (data) => axiosInstance.post('/api/auth/login', data),
  logout: () => axiosInstance.post('/api/auth/logout'),
  me: () => axiosInstance.get('/api/auth/me'),
};
