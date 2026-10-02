import { normalizeBlogStatus } from "../api/normalize";

export default function StatusBadge({ status }) {
  const normalizedStatus = normalizeBlogStatus(status);
  const isPublished = normalizedStatus === "publish";
  const label = isPublished
    ? "Published"
    : normalizedStatus === "draft"
      ? "Draft"
      : status || "Unknown";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isPublished
          ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800"
          : "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800"
      }`}
    >
      {label}
    </span>
  );
}
