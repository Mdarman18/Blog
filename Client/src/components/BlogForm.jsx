import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TagInput from "./TagInput";
import MarkdownContent from "./MarkdownContent";
import { optimizeImage } from "../utils/optimizeImage";
import { blogApi } from "../api/blogApi";
import toast from "react-hot-toast";
import { Sparkles, X } from "lucide-react";

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
    status: initialData?.status || "draft",
  });
  const [errors, setErrors] = useState({});
  const [titleTab, setTitleTab] = useState("write"); // CHANGED: title markdown tab
  const [contentTab, setContentTab] = useState("write");
  const [conclusionTab, setConclusionTab] = useState("write");
  const [isGenerating, setIsGenerating] = useState(false);

  const existingImages = initialData?.images || (initialData?.image ? [initialData.image] : []);

  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    let validFiles = [];
    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (imageFiles.length + validFiles.length > 5) {
      setErrors((prev) => ({ ...prev, images: "You can upload a maximum of 5 images." }));
      const availableSlots = Math.max(0, 5 - imageFiles.length);
      validFiles = validFiles.slice(0, availableSlots);
    } else {
      setErrors((prev) => ({ ...prev, images: undefined }));
    }

    setImageFiles((prev) => [...prev, ...validFiles]);
    
    // Clear input so same file can be selected again if removed
    e.target.value = null; 
  };

  const removeImage = (indexToRemove) => {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setErrors((prev) => ({ ...prev, images: undefined }));
  };

  const revertToExisting = () => {
    setImageFiles([]);
    setErrors((prev) => ({ ...prev, images: undefined }));
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
      onSubmit(formData, imageFiles); 
    }
  };

  const handleAIGenerate = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title first to generate content.");
      return;
    }
    
    if (formData.content.trim() && !window.confirm("This will overwrite your existing content. Do you want to proceed?")) {
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading("Generating content with AI...");
    
    try {
      const response = await blogApi.generateBlog(formData.title);
      const generatedContent = response.data?.data?.content || "";
      
      setFormData(prev => ({ ...prev, content: generatedContent }));
      toast.success("Content generated successfully!", { id: toastId });
      setContentTab("write");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate content.",
        { id: toastId }
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Title <span className="text-red-700 dark:text-red-400">*</span>
          </label>
          <button
            type="button"
            onClick={handleAIGenerate}
            disabled={isGenerating || isSubmitting}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 transition-colors dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isGenerating ? "Generating..." : "Generate with AI"}
          </button>
        </div>
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

      <div>
        <label
          htmlFor="images"
          className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
        >
          Blog Images (Max 5)
        </label>
        {imageFiles.length < 5 && (
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200 dark:text-gray-300 dark:file:bg-gray-700 dark:file:text-gray-100"
          />
        )}
        {errors.images && (
          <p className="mt-1 text-sm text-red-700 dark:text-red-400">
            {errors.images}
          </p>
        )}

        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {imageFiles.length} / 5 images selected
        </div>

        {/* Preview Newly Selected Images */}
        {imageFiles.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {previewUrls.map((url, idx) => (
              <div key={idx} className="group relative aspect-square rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <img
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  {idx + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  aria-label={`Remove image ${idx + 1}`}
                  className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Revert / Info about existing images */}
        {initialData && existingImages.length > 0 && (
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            {imageFiles.length > 0 ? (
              <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md border border-blue-100 dark:border-blue-800">
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  New images will replace all {existingImages.length} existing images upon save.
                </span>
                <button
                  type="button"
                  onClick={revertToExisting}
                  className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-300"
                >
                  Cancel replacing
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  Existing Images ({existingImages.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {existingImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={optimizeImage(img.url, 150)}
                      alt={`Existing ${idx + 1}`}
                      className="h-16 w-16 object-cover rounded border border-gray-300 dark:border-gray-600"
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">
                  Select new images to replace these existing ones.
                </p>
              </div>
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
