import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PenSquare, LogOut, Menu, X, LayoutDashboard, FileText } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
              <PenSquare className="h-6 w-6" />
              <span>BlogSpace</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link to="/my-posts" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1">
                  <FileText className="h-4 w-4" /> My Posts
                </Link>
                <Link to="/blogs/create" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2">
                  <PenSquare className="h-4 w-4" /> Write
                </Link>
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                  <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
                  <button onClick={handleLogout} className="text-gray-500 hover:text-danger transition-colors p-1" title="Logout">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-primary transition-colors font-medium">Login</Link>
                <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md font-medium transition-colors">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2">
          <div className="container mx-auto px-4 space-y-1 flex flex-col">
            <Link to="/" className="block py-2 text-gray-600 hover:text-primary" onClick={() => setIsMenuOpen(false)}>Home</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block py-2 text-gray-600 hover:text-primary" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link to="/my-posts" className="block py-2 text-gray-600 hover:text-primary" onClick={() => setIsMenuOpen(false)}>My Posts</Link>
                <Link to="/blogs/create" className="block py-2 text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Write a Post</Link>
                <div className="border-t border-gray-100 my-2 pt-2">
                  <p className="py-2 text-sm text-gray-500">Logged in as {user?.name}</p>
                  <button onClick={handleLogout} className="block w-full text-left py-2 text-danger hover:bg-red-50 rounded px-2 -mx-2">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-100 my-2 pt-2 flex flex-col space-y-2">
                <Link to="/login" className="block py-2 text-center border border-gray-300 rounded-md text-gray-700 font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block py-2 text-center bg-primary text-white rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
