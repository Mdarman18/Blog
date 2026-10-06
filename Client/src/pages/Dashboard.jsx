import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../api/adminApi";
import { blogApi } from "../api/blogApi";
import {
  normalizeBlogList,
  normalizeAdminStats,
  getBlogId,
  normalizeBlogStatus,
} from "../api/normalize";
import { FileText, CheckCircle, Clock, Edit, Trash2, Eye, XCircle } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // '' | 'Draft' | 'Published'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingStatusId, setTogglingStatusId] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await adminApi.getStats();
      setStats(normalizeAdminStats(res));
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await adminApi.getBlogs(params);
      const data = normalizeBlogList(res);
      if (import.meta.env.DEV) {
        console.debug(
          "[dashboard blog status]",
          data.blogs.map((blog) => ({
            blogId: getBlogId(blog),
            status: blog.status,
          })),
        );
      }
      setBlogs(data.blogs);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    // Basic debounce for search here
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, statusFilter, page]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const handleToggleStatus = async (blog) => {
    const id = getBlogId(blog);
    setTogglingStatusId(id);

    // Optimistic update
    const previousBlogs = [...blogs];
    const newStatus =
      normalizeBlogStatus(blog.status) === "publish" ? "draft" : "publish";

    setBlogs(
      blogs.map((b) => (getBlogId(b) === id ? { ...b, status: newStatus } : b)),
    );

    try {
      await adminApi.toggleStatus(id);
      toast.success(
        `Status changed to ${newStatus === "publish" ? "Published" : "Draft"}`,
      );
      fetchStats(); // refresh stats
    } catch (err) {
      toast.error("Failed to update status");
      setBlogs(previousBlogs); // Rollback
    } finally {
      setTogglingStatusId(null);
    }
  };

  const handleDelete = async (blog) => {
    if (!blog || isDeleting) return;

    if (user?.role !== "admin") {
      toast.error("You can not delete. Only admin can delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    const id = getBlogId(blog);
    if (!id) {
      toast.error("Cannot delete blog: ID is missing.");
      return;
    }
    setIsDeleting(true);

    try {
      await blogApi.deleteBlog(id);
      toast.success("Blog deleted successfully");
      const remainingBlogs = blogs.filter((b) => getBlogId(b) !== id);
      setBlogs(remainingBlogs);
      if (remainingBlogs.length === 0 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }
      setTotalPages((currentTotal) =>
        Math.max(1, currentTotal - (remainingBlogs.length === 0 ? 1 : 0)),
      );
      fetchStats();
    } catch (err) {
      const status = err.response?.status;
      const backendMessage = err.response?.data?.message;
      
      if (status === 403) {
        toast.error("You can not delete. Only admin can delete.");
        return;
      }

      const message =
        status === 401
          ? backendMessage || "Please sign in to delete this blog."
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

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your blogs and view statistics.
          </p>
        </div>
        <Link
          to="/blogs/create"
          className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-dark transition-colors dark:bg-cyan-300 dark:text-gray-950 dark:hover:bg-cyan-200"
        >
          Create New Blog
        </Link>
      </div>

      <ErrorMessage message={error} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/40 p-3 mr-4">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Blogs
            </p>
            {statsLoading ? (
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.total}
              </p>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900/40 p-3 mr-4">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Published
            </p>
            {statsLoading ? (
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.published}
              </p>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="rounded-full bg-amber-100 dark:bg-amber-900/40 p-3 mr-4">
            <Clock className="h-6 w-6 text-amber-600 dark:text-amber-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Drafts
            </p>
            {statsLoading ? (
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.draft}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Your Content
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Statuses</option>
              <option value="publish">Published</option>
              <option value="draft">Draft</option>
            </select>
            <div className="w-full sm:w-64">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search blogs..."
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                {user?.role === "admin" && (
                  <th className="px-6 py-4 font-medium">Author</th>
                )}
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Tags</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={user?.role === "admin" ? 6 : 5} className="px-6 py-12 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={user?.role === "admin" ? 6 : 5}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    No blogs found matching your criteria.
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr
                    key={getBlogId(blog)}
                    className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-62.5 dark:text-gray-100">
                      {blog.title}
                    </td>
                    {user?.role === "admin" && (
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {blog.author?.name || "Unknown"}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(blog)}
                        disabled={togglingStatusId === getBlogId(blog)}
                        className={`hover:opacity-80 transition-opacity ${togglingStatusId === getBlogId(blog) ? "opacity-50 cursor-not-allowed" : ""}`}
                        title="Click to toggle status"
                      >
                        <StatusBadge status={blog.status} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {blog.tags?.length > 0 ? (
                        <div className="flex gap-1 overflow-hidden max-w-37.5">
                          {blog.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded text-xs truncate"
                            >
                              {tag}
                            </span>
                          ))}
                          {blog.tags.length > 2 && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              +{blog.tags.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/blogs/${getBlogId(blog)}`}
                          className="p-1.5 text-gray-400 hover:text-primary transition-colors rounded dark:text-gray-500"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/blogs/${getBlogId(blog)}/edit`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded dark:text-gray-500 dark:hover:text-blue-400"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        {user?.role === "admin" ? (
                          <button
                            onClick={() => handleDelete(blog)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded dark:text-gray-500 dark:hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              toast.error("You can not delete. Only admin can delete.");
                            }}
                            className="p-1.5 text-gray-300 cursor-not-allowed transition-colors rounded dark:text-gray-600"
                            title="You can not delete. Only admin can delete."
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}