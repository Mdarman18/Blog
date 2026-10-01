import { useState } from "react";
import { Bookmark, ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { getBlogId } from "../api/normalize";
import StatusBadge from "./StatusBadge"; // Optional if you want to keep status capability

const getPlainTextExcerpt = (value) => {
  const plainText = String(value || "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1")
    .replace(/<https?:\/\/[^>]+>/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/^\s*```.*$/gm, "")
    .replace(/^\s*(?:[-+]\s+|\d+\.\s+)/gm, "")
    .replace(/[#*_`>~|]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return plainText.length > 150
    ? `${plainText.slice(0, 150).trim()}...`
    : plainText;
};

export default function BlogCard({
  blog,
  onTagClick,
  onBookmarkToggle,
  showStatus = false,
  index = 0,
}) {
  const [saved, setSaved] = useState(blog?.saved || false);
  const [imgFailed, setImgFailed] = useState(false);
  const id = getBlogId(blog);
  if (import.meta.env.DEV) {
    console.debug("[blog card status]", { blogId: id, status: blog?.status });
  }

  // Logic processing from the first component
  const date = blog?.createdAt
    ? new Date(blog.createdAt).toLocaleDateString()
    : "Unknown date";

  const authorName = blog?.author?.name || "Anonymous";
  const avatarUrl = blog?.author?.avatar || blog?.avatar;
  const imageUrl = blog?.image?.url || blog?.coverImage;

  const categoryName = blog?.category || blog?.tags?.[0] || "General";
  const readTimeString = blog?.readTime || "5 min read";
  const blogLink = `/blogs/${id}`;
  const excerpt = getPlainTextExcerpt(blog?.excerpt || blog?.content);

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    const newSavedState = !saved;
    setSaved(newSavedState);
    if (onBookmarkToggle) {
      onBookmarkToggle(blog, newSavedState);
    }
  };

  return (
    <article
      className="blog-card group relative h-105 w-full animate-fade-up overflow-hidden rounded-[22px] border opacity-0 transition-transform duration-500 hover:-translate-y-2 focus-within:ring-2 focus-within:ring-indigo-400"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background image */}
      {!imgFailed && imageUrl && (
        <img
          src={imageUrl}
          alt={blog?.title}
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[850ms] ease-out group-hover:scale-110"
        />
      )}

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/5 transition-colors duration-500 group-hover:from-black/95" />

      {/* Top row: badge + bookmark */}
      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]" />
            {categoryName}
          </span>
          {showStatus && blog?.status && <StatusBadge status={blog.status} />}
        </div>
        <button
          type="button"
          onClick={handleBookmarkClick}
          aria-label={saved ? "Remove bookmark" : "Save blog"}
          aria-pressed={saved}
          className="blog-card-bookmark cursor-pointer rounded-full border border-white/20 bg-black/30 p-2.5 text-white backdrop-blur-xl transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Bottom content */}
      <div className="blog-card-content absolute inset-x-3 bottom-3 rounded-[18px] p-4 text-white sm:inset-x-4 sm:bottom-4 sm:p-5">
        <h3 className="line-clamp-2 text-xl font-semibold leading-snug tracking-tight">
          {blog?.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/70">
          {excerpt}
        </p>

        <div className="mt-4 flex items-center gap-3 text-xs text-white/65">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={authorName}
              loading="lazy"
              className="h-9 w-9 rounded-full border border-white/40 p-0.5 object-cover shadow-[0_0_0_2px_rgba(255,255,255,0.08)]"
            />
          )}
          <div className="flex flex-col">
            <span className="font-medium text-white">{authorName}</span>
            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={12} aria-hidden="true" />
                {date}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 size={12} aria-hidden="true" />
                {readTimeString}
              </span>
            </span>
          </div>
        </div>

        <a
          href={blogLink}
          className="blog-card-action mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          <span className="blog-card-action-label">Read</span>
          <ArrowRight
            size={16}
            className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          />
        </a>
      </div>
    </article>
  );
}

export function BlogCardSkeleton({ index = 0 }) {
  return (
    <article
      className="blog-card group relative h-105 w-full animate-fade-up overflow-hidden rounded-[22px] border opacity-0"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Top row: badge + bookmark skeleton */}
      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
        <div className="animate-pulse bg-white/10 h-6 w-20 rounded-full"></div>
        <div className="animate-pulse bg-white/10 h-8 w-8 rounded-full"></div>
      </div>

      {/* Bottom content skeleton */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="animate-pulse bg-white/20 h-6 rounded w-3/4 mb-2"></div>
        <div className="animate-pulse bg-white/20 h-6 rounded w-1/2 mb-3"></div>

        <div className="animate-pulse bg-white/10 h-4 rounded w-full mb-2"></div>
        <div className="animate-pulse bg-white/10 h-4 rounded w-2/3 mb-4"></div>

        <div className="mt-4 flex items-center gap-3">
          <div className="animate-pulse bg-white/20 h-8 w-8 rounded-full"></div>
          <div className="flex flex-col gap-1.5">
            <div className="animate-pulse bg-white/20 h-3 w-24 rounded"></div>
            <div className="animate-pulse bg-white/10 h-3 w-32 rounded"></div>
          </div>
        </div>

        <div className="mt-4 animate-pulse bg-white/20 h-4 w-24 rounded"></div>
      </div>
    </article>
  );
}
