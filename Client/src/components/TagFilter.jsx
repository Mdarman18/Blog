import { X } from 'lucide-react';

export default function TagFilter({ tag, onClear }) {
  if (!tag) return null;
  
  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-gray-600 text-sm">Showing results for tag:</span>
      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20">
        #{tag}
        <button 
          onClick={onClear}
          className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
          title="Clear filter"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </span>
    </div>
  );
}
