import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { blogApi } from "../api/blogApi";
import { normalizeBlog, normalizeBlogStatus } from "../api/normalize";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Edit,
  Share2,
  Trash2,
  UserRound,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import MarkdownContent from "../components/MarkdownContent";
import toast from "react-hot-toast";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // { status, message }
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await blogApi.getBlog(id);
        const normalizedBlog = normalizeBlog(res);
        if (import.meta.env.DEV) {
          console.debug("[blog detail data]", {
            blogId: normalizedBlog?._id || id,
            status: normalizedBlog?.status,
          });
        }
        setBlog(normalizedBlog);
      } catch (err) {
        const status = err.response?.status;
        setError({
          status,
          message: status === 404 ? "Blog not found" : "Failed to load blog",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await blogApi.deleteBlog(blog._id || id);
      toast.success("Blog deleted successfully");
      navigate("/dashboard");
    } catch (err) {
      const status = err.response?.status;
      const backendMessage = err.response?.data?.message;
      const message =
        status === 401
          ? backendMessage || "Please sign in to delete this blog."
          : status === 403
            ? backendMessage || "You are not allowed to delete this blog."
            : status === 404
              ? backendMessage || "This blog no longer exists."
              : status === 400
                ? backendMessage || "The blog ID is invalid."
                : backendMessage || err.message || "Failed to delete blog.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: blog.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied");
      }
    } catch (err) {
      if (err.name !== "AbortError")
        toast.error("Could not share this article");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    if (error.status === 401) {
      return (
        <div className="py-16 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Login Required
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            You need to be logged in to view this blog.
          </p>
          <button
            onClick={() => {
              localStorage.setItem("redirectUrl", window.location.pathname);
              navigate("/login");
            }}
            className="rounded-md bg-primary px-6 py-2 font-medium text-white hover:bg-primary-dark"
          >
            Go to Login
          </button>
        </div>
      );
    }

    if (error.status === 404) {
      return (
        <div className="py-16 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Blog Not Found
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            The article you are looking for does not exist or has been removed.
          </p>
          <Link to="/" className="font-medium text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      );
    }

    return <ErrorMessage message={error.message} />;
  }

  if (!blog) return null;

  const userId = user?._id || user?.id;
  const authorId =
    typeof blog.author === "object"
      ? blog.author?._id || blog.author?.id
      : blog.author;
  const isAuthor = userId && authorId && String(userId) === String(authorId);
  const canDelete = isAuthor || user?.role === "admin";
  const authorName =
    typeof blog.author === "string"
      ? blog.author
      : blog.author?.name || "Anonymous";
  const date = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";
  const wordCount = (blog.content || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));
  const imageUrl = blog.image?.url || blog.coverImage;

  return (
    <article className="mx-auto max-w-5xl pb-20 pt-4 sm:pt-8">
      <header className="px-1 sm:px-4">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-500 transition-colors hover:text-primary dark:text-gray-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all blogs
            </Link>
            <span className="text-gray-300 dark:text-gray-700">/</span>
            <span className="text-gray-800 dark:text-gray-200">Details</span>
          </nav>

          <div className="flex items-center gap-2">
            {normalizeBlogStatus(blog.status) === "publish" ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-200">
                <span className="hero-live-dot h-2 w-2 rounded-full bg-cyan-600 dark:bg-cyan-300" />
                Published
              </span>
            ) : (
              <StatusBadge status={blog.status} />
            )}
            <button
              type="button"
              onClick={handleShare}
              title="Share article"
              aria-label="Share article"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <Share2 className="h-4 w-4" />
            </button>
            {canDelete && (
              <>
                <Link
                  to={`/blogs/${id}/edit`}
                  title="Edit article"
                  aria-label="Edit article"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  title="Delete article"
                  aria-label="Delete article"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:border-white/10 dark:text-gray-300 dark:hover:bg-rose-400/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          <h1 className="article-title text-balance text-4xl font-normal leading-[1.08] text-gray-950 dark:text-white sm:text-5xl lg:text-6xl">
            {blog.title}
          </h1>

          {blog.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-white/7 dark:text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-y border-gray-200/80 py-5 dark:border-white/10">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-900 dark:bg-cyan-900/50 dark:text-cyan-100">
                <UserRound className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {authorName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Author
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" />
                {readingMinutes} min read
              </span>
            </div>
          </div>
        </div>
      </header>

      {imageUrl && (
        <figure className="mx-1 mb-12 mt-8 sm:mx-4 sm:mt-10">
          <div className="aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <img
              src={imageUrl}
              alt={blog.title}
              className="h-full w-full object-cover"
            />
          </div>
        </figure>
      )}

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 px-1 sm:px-4">
        <div className="article-copy min-w-0">
          <MarkdownContent>{blog.content}</MarkdownContent>
        </div>

        {blog.conclusion && (
          <section className="border-l-2 border-cyan-700 bg-slate-50 px-5 py-5 dark:border-cyan-300 dark:bg-white/4 sm:px-7">
            <h2 className="article-title mb-2 text-2xl text-gray-900 dark:text-gray-100">
              Conclusion
            </h2>
            <MarkdownContent>{blog.conclusion}</MarkdownContent>
          </section>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </article>
  );
}
