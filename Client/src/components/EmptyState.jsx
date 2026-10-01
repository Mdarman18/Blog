import { FileQuestion } from "lucide-react";

export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4 dark:bg-gray-800">
        <FileQuestion className="h-8 w-8 text-gray-500 dark:text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-gray-100">
        {title}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6 dark:text-gray-400">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
