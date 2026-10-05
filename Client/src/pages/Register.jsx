import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight,
  BookOpenText,
  Eye,
  EyeOff,
  Lock,
  Mail,
  PenLine,
  Send,
  User,
  UserPlus,
  Key,
} from "lucide-react";
import ErrorMessage from "../components/ErrorMessage";
import toast from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("author");
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = localStorage.getItem("redirectUrl") || "/";
      localStorage.removeItem("redirectUrl");
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    if (!name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setError("");

    try {
      await register(name, email, password, role, role === "admin" ? adminKey : undefined);
      toast.success("Account created successfully");
      // Redirect is handled by the useEffect above
    } catch (err) {
      if (err.response?.status === 400) {
        setError(
          err.response?.data?.message || "Invalid data or email already exists",
        );
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-10 py-6 sm:py-10 lg:min-h-[calc(100vh-12rem)] lg:grid-cols-12 lg:gap-14">
      <div className="flex flex-col space-y-8 lg:col-span-6 lg:pt-4">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-800 text-white shadow-sm dark:bg-cyan-300 dark:text-gray-950">
              <BookOpenText className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Uthsonova
              </span>
              <span className="-mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                Writers Network
              </span>
            </span>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-200">
            <span className="hero-live-dot h-2 w-2 rounded-full bg-cyan-700 dark:bg-cyan-300" />
            A place for independent voices
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="max-w-2xl text-balance text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
            Share ideas. Learn together. Build something meaningful.
          </h1>
          <p className="max-w-xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
            Start your publishing journey. Write thoughtful articles, grow your
            audience, and join conversations that matter.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-4 rounded-xl bg-gray-100/80 p-4 transition-colors hover:bg-gray-100 dark:bg-white/4 dark:hover:bg-white/7">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-cyan-800 shadow-sm dark:bg-gray-800 dark:text-cyan-200">
              <PenLine className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                A focused writing space
              </h2>
              <p className="mt-1 text-sm leading-5 text-gray-600 dark:text-gray-400">
                Draft and preview your stories with Markdown support.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-xl bg-gray-100/80 p-4 transition-colors hover:bg-gray-100 dark:bg-white/4 dark:hover:bg-white/7">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-cyan-800 shadow-sm dark:bg-gray-800 dark:text-cyan-200">
              <BookOpenText className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Keep drafts and published work together
              </h2>
              <p className="mt-1 text-sm leading-5 text-gray-600 dark:text-gray-400">
                Manage your posts and decide when each story is ready to share.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-xl bg-gray-100/80 p-4 transition-colors hover:bg-gray-100 dark:bg-white/4 dark:hover:bg-white/7">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-cyan-800 shadow-sm dark:bg-gray-800 dark:text-cyan-200">
              <Send className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Share your work with readers
              </h2>
              <p className="mt-1 text-sm leading-5 text-gray-600 dark:text-gray-400">
                Publish articles to make them available in the blog feed.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center lg:col-span-6">
        <div className="w-full max-w-lg rounded-xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-900/5 dark:border-white/10 dark:bg-gray-800 sm:p-8 lg:p-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Create your account
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Join the community and start writing.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <ErrorMessage message={error} />

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-800 dark:text-gray-200"
              >
                Full name <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="h-11 w-full rounded-lg bg-gray-50 pl-10 pr-4 text-sm text-gray-900 shadow-[inset_0_0_0_1px_rgba(119,117,135,0.2)] transition-shadow placeholder:text-gray-400 focus:bg-white focus:outline-none focus:shadow-[inset_0_0_0_2px_var(--color-primary)] dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-gray-950"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <p className="pl-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                Your name appears on your author profile and published posts.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email-address"
                className="text-sm font-semibold text-gray-800 dark:text-gray-200"
              >
                Email address <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="h-11 w-full rounded-lg bg-gray-50 pl-10 pr-4 text-sm text-gray-900 shadow-[inset_0_0_0_1px_rgba(119,117,135,0.2)] transition-shadow placeholder:text-gray-400 focus:bg-white focus:outline-none focus:shadow-[inset_0_0_0_2px_var(--color-primary)] dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-gray-950"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-800 dark:text-gray-200"
                >
                  Password <span className="text-red-600">*</span>
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  At least 6 characters
                </span>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="h-11 w-full rounded-lg bg-gray-50 py-2.5 pl-10 pr-11 text-sm text-gray-900 shadow-[inset_0_0_0_1px_rgba(119,117,135,0.2)] transition-shadow placeholder:text-gray-400 focus:bg-white focus:outline-none focus:shadow-[inset_0_0_0_2px_var(--color-primary)] dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-gray-950"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Role <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="role"
                    value="author"
                    checked={role === "author"}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-4 w-4 text-primary focus:ring-primary dark:border-white/20 dark:bg-gray-900"
                  />
                  Author
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === "admin"}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-4 w-4 text-primary focus:ring-primary dark:border-white/20 dark:bg-gray-900"
                  />
                  Admin
                </label>
              </div>
            </div>

            {role === "admin" && (
              <div className="flex flex-col gap-1.5 animate-fade-in">
                <label
                  htmlFor="adminKey"
                  className="text-sm font-semibold text-gray-800 dark:text-gray-200"
                >
                  Admin Key <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Key className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    id="adminKey"
                    name="adminKey"
                    type="password"
                    required
                    className="h-11 w-full rounded-lg bg-gray-50 pl-10 pr-4 text-sm text-gray-900 shadow-[inset_0_0_0_1px_rgba(119,117,135,0.2)] transition-shadow placeholder:text-gray-400 focus:bg-white focus:outline-none focus:shadow-[inset_0_0_0_2px_var(--color-primary)] dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-gray-950"
                    placeholder="Enter the secret admin key"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                  />
                </div>
              </div>
            )}


            <button
              type="submit"
              disabled={isLoading}
              className="group mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-300 dark:text-gray-950 dark:hover:bg-cyan-200 dark:focus:ring-offset-gray-800"
            >
              {isLoading ? "Creating account..." : "Create account"}
              {!isLoading && (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              )}
              {isLoading && <UserPlus className="h-4 w-4" aria-hidden="true" />}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-200 pt-5 text-center dark:border-white/10">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
