import { useState, useEffect } from "react";
import { MessageSquare, Send, Trash2, User, ShieldCheck, CornerDownRight } from "lucide-react";
import { blogApi } from "../api/blogApi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function CommentsSection({ blogId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form fields
  const [commentText, setCommentText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await blogApi.getComments(blogId);
      const list = res.data?.data?.comments || res.data?.comments || [];
      setComments(list);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      return toast.error("Please enter a comment");
    }

    setSubmitting(true);
    try {
      const payload = {
        text: commentText.trim(),
        guestName: guestName.trim() || undefined,
        guestEmail: guestEmail.trim() || undefined,
      };

      const res = await blogApi.addComment(blogId, payload);
      const newComment = res.data?.data?.comment || res.data?.comment;

      if (newComment) {
        setComments((prev) => [newComment, ...prev]);
      } else {
        await fetchComments();
      }

      setCommentText("");
      setGuestName("");
      setGuestEmail("");
      toast.success("Comment posted successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to post comment";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (cId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    setDeletingId(cId);
    try {
      await blogApi.deleteComment(blogId, cId);
      setComments((prev) => prev.filter((c) => (c._id || c.id) !== cId));
      toast.success("Comment deleted");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete comment";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const currentUserId = user?._id || user?.id;
  const isAdmin = user?.role === "admin";

  return (
    <section className="mt-12 rounded-2xl border border-gray-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/60 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Discussion & Comments
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Join the conversation • {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </p>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit} className="mt-6 space-y-4">
        {!user && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Your Name <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Alex Smith"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-zinc-800/60 dark:text-gray-100 dark:focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Your Email <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-zinc-800/60 dark:text-gray-100 dark:focus:border-cyan-400"
              />
            </div>
          </div>
        )}

        <div>
          <div className="relative">
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={user ? `Comment as ${user.name || "author"}...` : "Write your thoughts on this post (no login needed)..."}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-zinc-800/60 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {user ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-cyan-600 dark:text-cyan-400">
                <ShieldCheck className="h-4 w-4" /> Logged in as {user.name}
              </span>
            ) : (
              <span>Guest commenting is enabled</span>
            )}
          </span>
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition-all hover:from-cyan-500 hover:to-blue-500 hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center dark:border-white/10">
            <MessageSquare className="mx-auto h-8 w-8 text-gray-400 opacity-60 dark:text-gray-500" />
            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              No comments yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Be the first to share your perspective!
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const commentId = comment._id || comment.id;
            const authorUser = comment.userId;
            const authorName = authorUser?.name || comment.guestName || "Guest Reader";
            const authorAvatar = authorUser?.avatar;
            const isUserOwner = authorUser?._id && currentUserId && String(authorUser._id) === String(currentUserId);
            const canDelete = isAdmin || isUserOwner;
            const createdDate = comment.createdAt
              ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Just now";

            return (
              <div
                key={commentId}
                className="group relative rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50 dark:border-white/5 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/70 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {authorAvatar ? (
                      <img
                        src={authorAvatar}
                        alt={authorName}
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-cyan-500/20"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-sm font-bold text-white shadow-inner">
                        {authorName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {authorName}
                        </span>
                        {authorUser && (
                          <span className="inline-flex items-center rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-medium text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300">
                            Member
                          </span>
                        )}
                        {!authorUser && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-zinc-700 dark:text-gray-300">
                            Guest
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {createdDate}
                      </span>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(commentId)}
                      disabled={deletingId === commentId}
                      title="Delete comment"
                      aria-label="Delete comment"
                      className="rounded-lg p-1.5 text-gray-400 opacity-80 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="mt-3 pl-12">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {comment.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
