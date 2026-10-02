import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TagInput from "./TagInput";
import MarkdownContent from "./MarkdownContent";
import { optimizeImage } from "../utils/optimizeImage";

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
  const [titleTab, setTitleTab] = useState("write"); // CHANGED: title markdown tab
  const [contentTab, setContentTab] = useState("write");
  const [conclusionTab, setConclusionTab] = useState("write");

  // CHANGED (image): selected file + preview
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    initialData?.image?.url || "",
  );

  // CHANGED (image): blob URL cleanup
  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // CHANGED (image)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Only image files are allowed" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image 5MB se chhoti honi chahiye",
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, image: undefined }));
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // CHANGED (image): nayi select ki hui image hatao (purani saved image wapas dikhegi)
  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(initialData?.image?.url || "");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.conclusion.trim())
      newErrors.conclusion = "Conclusion is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Send changed fields if it's edit, or full data if it's create.
      // For simplicity here, we send all data, which works for both CREATE and PUT.
      onSubmit(formData, imageFile); // CHANGED (image): 2nd argument = file
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
        >
          Title <span className="text-red-700 dark:text-red-400">*</span>
        </label>
        {/* CHANGED: title ke liye Write / Preview tabs */}
        <div
          className="mb-2 flex gap-2"
          role="tablist"
          aria-label="Title editor"
        >
          {[
            ["write", "Write"],
            ["preview", "Preview"],
          ].map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={titleTab === tab}
              onClick={() => setTitleTab(tab)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                titleTab === tab
                  ? "border-primary text-primary"
                  : "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {titleTab === "write" ? (
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className={`w-full bg-white text-gray-900 placeholder-gray-500 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 ${
              errors.title
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="Blog Title (Markdown supported)"
          />
        ) : (
          <div className="min-h-12 rounded-md border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-800">
            <MarkdownContent>{formData.title}</MarkdownContent>
          </div>
        )}
        {errors.title && (
          <p className="mt-1 text-sm text-red-700 dark:text-red-400">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
        >
          Content <span className="text-red-700 dark:text-red-400">*</span>
        </label>
        <div
          className="mb-2 flex gap-2"
          role="tablist"
          aria-label="Content editor"
        >
          {[
            ["write", "Write"],
            ["preview", "Preview"],
          ].map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={contentTab === tab}
              onClick={() => setContentTab(tab)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                contentTab === tab
                  ? "border-primary text-primary"
                  : "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {contentTab === "write" ? (
          <textarea
            id="content"
            rows="12"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className={`w-full bg-white text-gray-900 placeholder-gray-500 px-4 py-2 border rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 ${
              errors.content
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="Write in Markdown..."
          ></textarea>
        ) : (
          <div className="min-h-64 rounded-md border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
            <MarkdownContent>{formData.content}</MarkdownContent>
          </div>
        )}
        {errors.content && (
          <p className="mt-1 text-sm text-red-700 dark:text-red-400">
            {errors.content}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="conclusion"
          className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
        >
          Conclusion <span className="text-red-700 dark:text-red-400">*</span>
        </label>
        <div
          className="mb-2 flex gap-2"
          role="tablist"
          aria-label="Conclusion editor"
        >
          {[
            ["write", "Write"],
            ["preview", "Preview"],
          ].map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={conclusionTab === tab}
              onClick={() => setConclusionTab(tab)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                conclusionTab === tab
                  ? "border-primary text-primary"
                  : "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {conclusionTab === "write" ? (
          <textarea
            id="conclusion"
            rows="4"
            value={formData.conclusion}
            onChange={(e) =>
              setFormData({ ...formData, conclusion: e.target.value })
            }
            className={`w-full bg-white text-gray-900 placeholder-gray-500 px-4 py-2 border rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 ${
              errors.conclusion
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="Write in Markdown..."
          ></textarea>
        ) : (
          <div className="min-h-32 rounded-md border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
            <MarkdownContent>{formData.conclusion}</MarkdownContent>
          </div>
        )}
        {errors.conclusion && (
          <p className="mt-1 text-sm text-red-700 dark:text-red-400">
            {errors.conclusion}
          </p>
        )}
      </div>

      {/* CHANGED (image): image upload field */}
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
        >
          Cover Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200 dark:text-gray-300 dark:file:bg-gray-700 dark:file:text-gray-100"
        />
        {errors.image && (
          <p className="mt-1 text-sm text-red-700 dark:text-red-400">
            {errors.image}
          </p>
        )}
        {imagePreview && (
          <div className="mt-3">
            <img
              src={optimizeImage(imagePreview, 800)}
              alt="Blog cover preview"
              width="800"
              height="450"
              loading="lazy"
              decoding="async"
              className="max-h-56 rounded-md border border-gray-300 object-cover dark:border-gray-600"
            />
            {imageFile && (
              <button
                type="button"
                onClick={handleImageRemove}
                className="mt-2 text-sm text-red-700 hover:underline dark:text-red-400"
              >
                Remove selected image
              </button>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
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
          className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
        >
          Status
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full bg-white text-gray-900 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
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
          className="flex-1 bg-primary text-white py-2 px-4 rounded-md font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-cyan-300 dark:text-gray-950 dark:hover:bg-cyan-200"
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
          className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-colors dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
