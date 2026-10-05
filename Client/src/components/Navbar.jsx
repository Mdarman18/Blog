import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  PenSquare,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  FileText,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { getFirstLetters } from "../utlis/help";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  // Get the first letter of the user's name (uppercase)
  const getFirstLetter = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/85 text-gray-800 shadow-lg shadow-gray-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-[#07070b]/75 dark:text-white dark:shadow-black/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-gray-900 transition-opacity hover:opacity-80 dark:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-200 bg-linear-to-br from-indigo-400/20 to-cyan-300/10 text-cyan-800 shadow-inner shadow-white/5 dark:border-white/10 dark:text-cyan-200 dark:shadow-white/5">
                <PenSquare className="h-4.5 w-4.5" />
              </span>
              <span>Uthsonova Blog</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center space-x-6 md:flex">
            <Link
              to="/"
              className="text-sm text-gray-700 transition-colors hover:text-gray-950 dark:text-white/65 dark:hover:text-white"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 text-sm text-gray-700 transition-colors hover:text-gray-950 dark:text-white/65 dark:hover:text-white"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                )}
                <Link
                  to="/my-posts"
                  className="flex items-center gap-1.5 text-sm text-gray-700 transition-colors hover:text-gray-950 dark:text-white/65 dark:hover:text-white"
                >
                  <FileText className="h-4 w-4" /> My Posts
                </Link>
                <Link
                  to="/blogs/create"
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 shadow-lg shadow-gray-900/5 transition hover:border-gray-300 hover:bg-gray-200 dark:border-white/10 dark:bg-white/9 dark:text-white dark:shadow-black/10 dark:hover:border-white/20 dark:hover:bg-white/14"
                >
                  <PenSquare className="h-4 w-4" /> Write
                </Link>

                {/* User Profile & Logout section */}
                <div className="ml-4 flex items-center gap-3 border-l border-gray-200 pl-4 dark:border-white/10">
                  {/* Rounded box showing only the first letter */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600/10 border border-indigo-200 text-xs font-bold text-indigo-700 dark:border-white/10 dark:bg-white/10 dark:text-cyan-200">
                    {getFirstLetter(user?.name)}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg p-2 text-gray-500 transition-colors cursor-pointer hover:bg-rose-800 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-rose-300 dark:focus-visible:ring-cyan-300"
                    title="Logout"
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-950 dark:text-white/70 dark:hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-linear-to-r from-indigo-700 to-cyan-800 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-950/20 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:from-indigo-700 dark:to-cyan-800 dark:shadow-indigo-950/40 dark:focus-visible:ring-cyan-200"
                >
                  Register
                </Link>
              </div>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-white/65 dark:hover:bg-white/5 dark:hover:text-white dark:focus-visible:ring-cyan-300"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white/95 py-3 text-gray-800 backdrop-blur-2xl dark:border-white/10 dark:bg-[#0b0c12]/95 dark:text-white md:hidden">
          <div className="container mx-auto px-4 space-y-1 flex flex-col">
            <Link
              to="/"
              className="block rounded-lg py-2.5 text-gray-700 transition-colors hover:bg-gray-100 hover:px-3 hover:text-gray-950 dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link
                    to="/dashboard"
                    className="block rounded-lg py-2.5 text-gray-700 transition-colors hover:bg-gray-100 hover:px-3 hover:text-gray-950 dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/my-posts"
                  className="block rounded-lg py-2.5 text-gray-700 transition-colors hover:bg-gray-100 hover:px-3 hover:text-gray-950 dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Posts
                </Link>
                <Link
                  to="/blogs/create"
                  className="block rounded-lg py-2.5 font-medium text-cyan-800 transition-colors hover:bg-gray-100 hover:px-3 dark:text-cyan-200 dark:hover:bg-white/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Write a Post
                </Link>
                <div className="my-2 border-t border-gray-200 pt-2 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm text-gray-600 dark:text-white/55">
                      {user?.name || "User"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg px-3 py-1.5 text-sm text-rose-700 transition-colors hover:bg-rose-100 dark:text-rose-300 dark:hover:bg-rose-400/10"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="my-2 flex flex-col space-y-2 border-t border-gray-200 pt-3 dark:border-white/10">
                <Link
                  to="/login"
                  className="block rounded-xl border border-gray-200 py-2.5 text-center font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-white/80 dark:hover:bg-white/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block rounded-xl bg-linear-to-r from-indigo-700 to-cyan-800 py-2.5 text-center font-medium text-white shadow-lg shadow-indigo-950/20 dark:from-indigo-700 dark:to-cyan-800 dark:shadow-indigo-950/40"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
