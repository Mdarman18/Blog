import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Eye, EyeOff, Lock, Mail, LogIn } from "lucide-react";
import ErrorMessage from "../components/ErrorMessage";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = localStorage.getItem("redirectUrl") || "/dashboard";
      localStorage.removeItem("redirectUrl");
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      toast.success("Logged in successfully");
      // Redirect is handled by the useEffect above
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError(
          err.response?.data?.message || "Failed to login. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 py-6 sm:py-10 lg:min-h-[calc(100vh-12rem)] lg:grid-cols-12 lg:gap-12">
      <div className="flex flex-col justify-between lg:col-span-7 lg:pr-6">
        <div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-cyan-900 shadow-sm dark:bg-cyan-950/50 dark:text-cyan-200">
              <span className="hero-live-dot h-2 w-2 rounded-full bg-cyan-700 dark:bg-cyan-300" />
              Author portal
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              A home for thoughtful ideas
            </span>
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl">
              Share ideas.
              <br />
              Learn together.
              <br />
              <span className="text-primary">Build something meaningful.</span>
            </h1>
            <p className="max-w-xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
              Join a community of writers and readers sharing thoughtful
              narratives, technical deep dives, and new perspectives.
            </p>
          </div>
        </div>

        <div className="mt-8 max-w-2xl overflow-hidden rounded-xl border border-gray-200/80 bg-white/75 p-5 shadow-sm dark:border-white/10 dark:bg-white/4 sm:mt-12 sm:p-7">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="h-px w-7 bg-primary" />
            The Uthsonova journal
          </div>
          <p className="max-w-xl text-lg leading-7 text-gray-800 dark:text-gray-100 sm:text-xl sm:leading-8">
            A quieter space for clear thinking, careful craft, and ideas worth
            passing along.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-200 pt-4 text-sm text-gray-500 dark:border-white/10 dark:text-gray-400">
            <span>Essays</span>
            <span>Engineering</span>
            <span>Design</span>
            <span>Research</span>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-center lg:col-span-5 lg:justify-end">
        <div className="w-full max-w-115 rounded-xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-900/5 dark:border-white/10 dark:bg-gray-800 sm:p-8 lg:p-10">
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Welcome back
              </h2>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                <Lock className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
              Sign in to access your drafts, bookmarks, and publication tools.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <ErrorMessage message={error} />

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  Email address
                </label>
                <div className="relative rounded-lg bg-gray-50 transition-colors focus-within:bg-white dark:bg-gray-900 dark:focus-within:bg-gray-950">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="h-11 w-full rounded-lg bg-transparent pl-10 pr-3.5 text-sm text-gray-900 shadow-[inset_0_0_0_1px_rgba(119,117,135,0.2)] transition-shadow placeholder:text-gray-400 focus:outline-none focus:shadow-[inset_0_0_0_2px_var(--color-primary)] dark:text-gray-100 dark:placeholder:text-gray-500"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  Password
                </label>
                <div className="relative rounded-lg bg-gray-50 transition-colors focus-within:bg-white dark:bg-gray-900 dark:focus-within:bg-gray-950">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="h-11 w-full rounded-lg bg-transparent py-2.5 pl-10 pr-11 text-sm text-gray-900 shadow-[inset_0_0_0_1px_rgba(119,117,135,0.2)] transition-shadow placeholder:text-gray-400 focus:outline-none focus:shadow-[inset_0_0_0_2px_var(--color-primary)] dark:text-gray-100 dark:placeholder:text-gray-500"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-cyan-300 dark:text-gray-950 dark:hover:bg-cyan-200 dark:focus:ring-offset-gray-800"
            >
              {isLoading ? "Signing in..." : "Sign in to your account"}
              {!isLoading && (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              )}
              {isLoading && <LogIn className="h-4 w-4" aria-hidden="true" />}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-200 pt-5 text-center dark:border-white/10">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
