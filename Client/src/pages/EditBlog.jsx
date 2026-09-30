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

  const handleSubmit = async (data) => {
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

    if (Object.keys(changedFields).length === 0) {
      toast.success("Kuch change nahi hua");
      setIsSubmitting(false);
      return;
    }

    // DEBUG: remove after fix
    if (import.meta.env.DEV) console.log("PUT payload:", changedFields);
    console.log("Id", id);
    try {
      await blogApi.updateBlog(id, changedFields);
      toast.success("Blog updated successfully!");
      navigate(`/blogs/${id}`);
    } catch (err) {
      // DEBUG: remove after fix
      console.log("PUT error response:", err.response?.data);

      if (err.response?.status !== 403) {
        // FIX: Display specific server error msg
        const msg =
          err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Validation error";
        toast.error(msg);
        console.log(msg);
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
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
        <p className="text-gray-600 mt-2">Update your article details below.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
        <BlogForm
          initialData={blog}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
