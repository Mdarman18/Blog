import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { blogApi } from "../api/blogApi";
import BlogForm from "../components/BlogForm";
import toast from "react-hot-toast";

export default function CreateBlog() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data, imageFile) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, key === "tags" ? JSON.stringify(value) : value);
      });
      if (imageFile) formData.append("image", imageFile);

      await blogApi.createBlog(formData);
      toast.success("Blog created successfully!");
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status !== 403) {
        // 403 is handled globally
        toast.error(
          err.response?.data?.message ||
            "Failed to create blog. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 border-b border-gray-200 pb-4 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Write a New Blog
        </h1>
        <p className="text-gray-600 mt-2 dark:text-gray-300">
          Share your thoughts with the world.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <BlogForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
