import { Link } from "react-router-dom";
import { getBlogId } from "../api/normalize";
import { Calendar, User } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function BlogCard({ blog, onTagClick, showStatus = false }) {


  const id = getBlogId(blog);
  const date = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString()
    : "Unknown date";

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <Link to={`/blogs/${id}`} className="block group">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
              {blog.title}
            </h3>
          </Link>
          {showStatus && <StatusBadge status={blog.status} />}
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3 grow whitespace-pre-line">
          {blog.content}
        </p>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.preventDefault();
                  if (onTagClick) onTagClick(tag);
                }}
                className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* FIX: Read more button added */}
        <Link
          to={`/blogs/${id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded w-fit"
        >
          Read more <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <User className="h-4 w-4" />
          <span className="truncate max-w-30">
            {blog.author?.name || "Anonymous"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="p-6 grow">
        <div className="animate-pulse bg-gray-200 h-7 rounded w-3/4 mb-4"></div>
        <div className="animate-pulse bg-gray-200 h-4 rounded w-full mb-2"></div>
        <div className="animate-pulse bg-gray-200 h-4 rounded w-full mb-2"></div>
        <div className="animate-pulse bg-gray-200 h-4 rounded w-2/3 mb-6"></div>
        <div className="flex gap-2">
          <div className="animate-pulse bg-gray-200 h-6 w-16 rounded-full"></div>
          <div className="animate-pulse bg-gray-200 h-6 w-16 rounded-full"></div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between">
        <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
      </div>
    </div>
  );
}