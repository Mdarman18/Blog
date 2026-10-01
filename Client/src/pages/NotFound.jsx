import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-black text-gray-500 dark:text-gray-500">
        404
      </h1>
      <h2 className="text-3xl font-bold text-gray-900 mt-4 dark:text-gray-100">
        Page not found
      </h2>
      <p className="text-gray-500 mt-2 mb-8 max-w-md dark:text-gray-400">
        Sorry, we couldn't find the page you're looking for. Perhaps you've
        mistyped the URL or the page has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors dark:bg-cyan-300 dark:text-gray-950 dark:hover:bg-cyan-200"
      >
        <Home className="h-5 w-5" />
        Back to Home
      </Link>
    </div>
  );
}
