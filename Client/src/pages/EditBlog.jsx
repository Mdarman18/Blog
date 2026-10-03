import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogApi } from "../api/blogApi";
import { normalizeBlog } from "../api/normalize";
import BlogForm from "../components/BlogForm";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import toast from "react-hot-toast";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await blogApi.getBlog(id);
        setBlog(normalizeBlog(res));
      } catch (err) {
        setError("Failed to load blog data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSubmit = async (data, imageFiles) => {
    setIsSubmitting(true);

    // FIX: Send only changed fields, or early return if nothing changed
    const changedFields = {};
    Object.keys(data).forEach((key) => {
      // Simple shallow comparison is enough here
      if (data[key] !== (blog[key] || "")) {
        // avoid undefined !== "" issues
        changedFields[key] = data[key];
      }
    });

    const hasNewImages = imageFiles && imageFiles.length > 0;

    if (Object.keys(changedFields).length === 0 && !hasNewImages) {
      toast.success("Kuch change nahi hua");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    Object.entries(changedFields).forEach(([key, value]) => {
      formData.append(key, key === "tags" ? JSON.stringify(value) : value);
    });
    
    if (hasNewImages) {
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      await blogApi.updateBlog(id, formData);
      toast.success("Blog updated successfully!");
      navigate(`/blogs/${id}`);
    } catch (err) {
      if (err.response?.status !== 403) {
        // FIX: Display specific server error msg
        const msg =
          err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Validation error";
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <ErrorMessage message={error} />
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-primary hover:underline font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 border-b border-gray-200 pb-4 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Edit Blog
        </h1>
        <p className="text-gray-600 mt-2 dark:text-gray-300">
          Update your article details below.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <BlogForm
          initialData={blog}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
