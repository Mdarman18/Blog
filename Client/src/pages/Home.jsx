import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { blogApi } from "../api/blogApi";
import { normalizeBlogList } from "../api/normalize";
import { useDebounce } from "../hooks/useDebounce";
import BlogGrid from "../components/BlogGrid";
import SearchBar from "../components/SearchBar";
import TagFilter from "../components/TagFilter";
import Pagination from "../components/Pagination";
import ErrorMessage from "../components/ErrorMessage";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // State for pagination
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // Number of items per page

  // Controlled inputs state, synced with URL params on mount
  const initialSearch = searchParams.get("search") || "";
  const initialTag = searchParams.get("tag") || "";
  const initialPage = parseInt(searchParams.get("page")) || 1;

  const [searchInput, setSearchInput] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchInput, 400);
  const [activeTag, setActiveTag] = useState(initialTag);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const abortControllerRef = useRef(null);

  // Sync state to URL params whenever they change, but only if they differ from current URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (activeTag) params.set("tag", activeTag);
    if (currentPage > 1) params.set("page", currentPage.toString());

    setSearchParams(params, { replace: true });
  }, [debouncedSearch, activeTag, currentPage, setSearchParams]);

  // Fetch data when params change
  useEffect(() => {
    const fetchBlogs = async () => {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);
      setError("");

      try {
        const res = await blogApi.getBlogs(
          {
            search: debouncedSearch || undefined,
            tag: activeTag || undefined,
            page: currentPage,
            limit,
          },
          { signal: abortControllerRef.current.signal },
        );
        // fetchBlogs ke andar, res aane ke baad:
        const normalized = normalizeBlogList(res);

        const { blogs: fetchedBlogs, totalPages: fetchedTotalPages } =
          normalizeBlogList(res);
        setBlogs(fetchedBlogs);
        setTotalPages(fetchedTotalPages);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setError("Failed to load blogs. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearch, activeTag, currentPage]);

  // Reset to page 1 when search or tag changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeTag]);

  const handleTagClick = (tag) => {
    setActiveTag(tag);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearTag = () => {
    setActiveTag("");
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="mb-10 flex flex-col items-start justify-between gap-7 border-b border-gray-200 pb-8 md:mb-12 md:flex-row md:items-end dark:border-white/10">
        <div className="max-w-2xl">
          <div className="hero-badge mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium">
            <span className="hero-live-dot h-1.5 w-1.5 rounded-full bg-emerald-300" />
            A publication for curious minds
          </div>
          <h1 className="hero-title mb-3 text-4xl font-semibold leading-tight sm:text-5xl">
            Explore Blogs
          </h1>
          <p className="max-w-xl text-base leading-7 text-gray-600 dark:text-white/70">
            Discover the latest articles, tutorials, and updates.
          </p>
          <div className="hero-divider mt-6 h-px w-32" aria-hidden="true" />
        </div>
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Search by title, content or tags..."
        />
      </div>

      <TagFilter tag={activeTag} onClear={handleClearTag} />

      <ErrorMessage
        message={error}
        onRetry={() => {
          setSearchInput(initialSearch);
          setActiveTag("");
          setCurrentPage(1);
        }}
      />

      <BlogGrid blogs={blogs} loading={loading} onTagClick={handleTagClick} />

      {!loading && !error && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}
