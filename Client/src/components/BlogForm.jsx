import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TagInput from "./TagInput";

export default function BlogForm({
  initialData = null,
  onSubmit,
  isSubmitting,
}) {
  const navigate = useNavigate();
  // FIX: Match case-sensitive exact Status values
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    conclusion: initialData?.conclusion || "",
    tags: initialData?.tags || [],
    status: initialData?.status || "Draft",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.conclusion.trim())
      newErrors.conclusion = "Conclusion is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  console.log("formData", formData);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Send changed fields if it's edit, or full data if it's create.
      // For simplicity here, we send all data, which works for both CREATE and PUT.
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Blog Title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          rows="12"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
            errors.content ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Write your blog content here..."
        ></textarea>
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="conclusion"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Conclusion <span className="text-red-500">*</span>
        </label>
        <textarea
          id="conclusion"
          rows="4"
          value={formData.conclusion}
          onChange={(e) =>
            setFormData({ ...formData, conclusion: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
            errors.conclusion ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Summarize your article..."
        ></textarea>
        {errors.conclusion && (
          <p className="mt-1 text-sm text-red-500">{errors.conclusion}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <TagInput
          tags={formData.tags}
          onChange={(tags) => setFormData({ ...formData, tags })}
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Status
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white"
        >
          {/* FIX: Use exact case-sensitive Status values */}
          <option value="draft">Draft</option>
          <option value="publish">Published</option>
        </select>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary text-white py-2 px-4 rounded-md font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Update Blog"
              : "Create Blog"}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
          className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
