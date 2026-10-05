import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle global errors (like 401, 403, 500)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    // Ignore 401 for /auth/me because we handle it in context
    const isAuthMe = error.config && error.config.url === "/api/auth/me";
    // Ignore 401 for /auth/login and /auth/register
    const isAuthLoginRegister =
      error.config &&
      (error.config.url === "/api/auth/login" ||
        error.config.url === "/api/auth/register");

    if (status === 401 && !isAuthMe && !isAuthLoginRegister) {
      // Clear token and redirect to login
      localStorage.removeItem("token");
      // Store current path to redirect back later, avoid storing if we are already at login
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register") {
        localStorage.setItem(
          "redirectUrl",
          currentPath + window.location.search,
        );
        window.location.href = "/login";
      }
    } else if (status === 403) {
      const backendMessage = error.response?.data?.message;
      toast.error(backendMessage || "You don't have permission to do this");
    } else if (status === 500) {
      // toast.error("Something went wrong, try again");
    }

    return Promise.reject(error);
  },
);
