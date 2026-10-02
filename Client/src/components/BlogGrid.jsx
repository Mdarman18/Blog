import BlogCard, { BlogCardSkeleton } from "./BlogCard";
import EmptyState from "./EmptyState";

export default function BlogGrid({
  blogs,
  loading,
  onTagClick,
  showStatus = false,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {[...Array(6)].map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          title="No blogs found"
          description="We couldn't find any articles matching your criteria."
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {blogs.map((blog, idx) => (
        <BlogCard
          key={blog._id || blog.id || idx}
          blog={blog}
          index={idx}
          onTagClick={onTagClick}
          showStatus={showStatus}
        />
      ))}
    </div>
  );
}
