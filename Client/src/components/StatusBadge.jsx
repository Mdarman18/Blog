export default function StatusBadge({ status }) {
  const isPublished = status?.toLowerCase() === 'published';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isPublished 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-amber-100 text-amber-800 border border-amber-200'
    }`}>
      {isPublished ? 'publish' : 'draft'}
    </span>
  );
}
