import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogApi } from '../api/blogApi';
import { normalizeBlog } from '../api/normalize';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // { status, message }
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await blogApi.getBlog(id);
        setBlog(normalizeBlog(res));
      } catch (err) {
        const status = err.response?.status;
        setError({
          status,
          message: status === 404 ? 'Blog not found' : 'Failed to load blog'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await blogApi.deleteBlog(id);
      toast.success('Blog deleted successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to delete blog');
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    if (error.status === 401) {
      return (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view this blog.</p>
          <button 
            onClick={() => {
              localStorage.setItem('redirectUrl', window.location.pathname);
              navigate('/login');
            }}
            className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary-dark"
          >
            Go to Login
          </button>
        </div>
      );
    }
    
    if (error.status === 404) {
      return (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h2>
          <p className="text-gray-600 mb-6">The article you are looking for does not exist or has been removed.</p>
          <Link to="/" className="text-primary hover:underline font-medium">Back to Home</Link>
        </div>
      );
    }

    return <ErrorMessage message={error.message} />;
  }

  if (!blog) return null;

  // Check if current user is the author
  const isAuthor = user && blog.author && (user._id === blog.author._id || user.id === blog.author.id);
  const date = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : 'Unknown date';

  return (
    <article className="max-w-3xl mx-auto py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags?.map((tag) => (
              <span key={tag} className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100 mb-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-5 w-5" />
                <span className="font-medium">{blog.author?.name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>{date}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {blog.status === 'draft' && <StatusBadge status={blog.status} />}
              
              {isAuthor && (
                <div className="flex items-center gap-2 ml-4">
                  <Link 
                    to={`/blogs/${id}/edit`}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-md transition-colors"
                    title="Edit Blog"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="p-2 text-gray-500 hover:text-danger hover:bg-red-50 rounded-md transition-colors"
                    title="Delete Blog"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line mb-10">
            {blog.content}
          </div>

          {blog.conclusion && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Conclusion</h3>
              <p className="text-gray-700 whitespace-pre-line">{blog.conclusion}</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </article>
  );
}
