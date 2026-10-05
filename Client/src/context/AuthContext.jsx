import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/authApi';
import { normalizeUser, normalizeAuthToken } from '../api/normalize';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.me();
      const userData = normalizeUser(res);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      // 401 is handled by interceptor but we need to clear local state
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const token = normalizeAuthToken(res);
    if (token) {
      localStorage.setItem('token', token);
    }
    const userData = normalizeUser(res);
    setUser(userData);
    setIsAuthenticated(true);
    return res;
  };

  const register = async (name, email, password, role, adminKey) => {
    const res = await authApi.register({ name, email, password, role, adminKey });
    const token = normalizeAuthToken(res);
    if (token) {
      localStorage.setItem('token', token);
    }
    const userData = normalizeUser(res);
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore logout error on server, we still clear local state
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);