import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex space-x-1">
        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;
          // Simple pagination - show a few pages around current if many
          if (totalPages > 5) {
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= page - 1 && pageNum <= page + 1)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    page === pageNum
                      ? "bg-gray-200 text-gray-900 border border-gray-300 dark:bg-white/15 dark:text-white dark:border-white/30"
                      : "border border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
            if (pageNum === page - 2 || pageNum === page + 2) {
              return (
                <span
                  key={pageNum}
                  className="px-2 py-2 text-gray-500 dark:text-white/60"
                >
                  ...
                </span>
              );
            }
            return null;
          }

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                page === pageNum
                  ? "bg-gray-200 text-gray-900 border border-gray-300 dark:bg-white/15 dark:text-white dark:border-white/30"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
