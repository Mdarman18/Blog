import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the current location they were trying to go to
    localStorage.setItem('redirectUrl', location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
