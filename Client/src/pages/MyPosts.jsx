import { useState, useEffect, useMemo } from "react";
import { blogApi } from "../api/blogApi";
import { normalizeBlogList } from "../api/normalize";
import BlogGrid from "../components/BlogGrid";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import ErrorMessage from "../components/ErrorMessage";

export default function MyPosts() {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Client-side filtering/pagination state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await blogApi.getMyPosts();
        // Since my-posts returns all posts without pagination, we normalize and get the array
        const data = normalizeBlogList(res);
        setAllPosts(data.blogs);
      } catch (err) {
        setError("Failed to load your posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  // Client-side search and filtering
  const filteredPosts = useMemo(() => {
    if (!search.trim()) return allPosts;
    const query = search.toLowerCase();

    return allPosts.filter((post) => {
      const matchTitle = post.title?.toLowerCase().includes(query);
      const matchContent = post.content?.toLowerCase().includes(query);
      const matchTags = post.tags?.some((tag) =>
        tag.toLowerCase().includes(query),
      );
      return matchTitle || matchContent || matchTags;
    });
  }, [allPosts, search]);

  // Client-side pagination
  const totalPages = Math.ceil(filteredPosts.length / limit) || 1;
  const paginatedPosts = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredPosts.slice(startIndex, startIndex + limit);
  }, [filteredPosts, page]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">
            My Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            All the articles you've written.
          </p>
        </div>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search your posts..."
        />
      </div>

      <ErrorMessage message={error} onRetry={() => window.location.reload()} />

      <BlogGrid blogs={paginatedPosts} loading={loading} showStatus={true} />

      {!loading && !error && filteredPosts.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}
