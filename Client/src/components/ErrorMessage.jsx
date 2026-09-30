import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  
  return (
    <div className="rounded-md bg-red-50 p-4 mb-4 border border-red-200">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-red-700">{message}</p>
          {onRetry && (
            <p className="mt-2 text-sm md:mt-0 md:ml-6">
              <button
                onClick={onRetry}
                className="whitespace-nowrap font-medium text-red-700 hover:text-red-600 underline"
              >
                Try again
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
