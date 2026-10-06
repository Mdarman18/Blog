import { normalizeBlogStatus } from "../api/normalize";

export default function StatusBadge({ status }) {
  const normalizedStatus = normalizeBlogStatus(status);
  const isPublished = normalizedStatus === "publish";
  const isScheduled = normalizedStatus === "scheduled";
  const label = isPublished
    ? "Published"
    : isScheduled
      ? "Scheduled"
      : normalizedStatus === "draft"
        ? "Draft"
        : status || "Unknown";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isPublished
          ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800"
          : isScheduled
            ? "bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800"
            : "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800"
      }`}
    >
      {label}
    </span>
  );
}
