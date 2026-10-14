import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'authUser';
const AUTH_TOKEN_KEY = 'authToken';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error('Failed to parse authUser from localStorage:', err);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [initialChecking, setInitialChecking] = useState(true);

  // Verify stored session with backend on mount
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          localStorage.removeItem(AUTH_STORAGE_KEY);
          localStorage.removeItem(AUTH_TOKEN_KEY);
          setUser(null);
        }
      }
      setInitialChecking(false);
    };

    verifySession();
  }, []);

  /**
   * Login handler connecting to backend API
   */
  const login = async (arg1, arg2, arg3) => {
    setLoading(true);

    let identifier = '';
    let password = '';
    let selectedRole = 'student';

    if (typeof arg1 === 'object' && arg1 !== null) {
      identifier = (arg1.identifier || arg1.email || arg1.studentId || '').trim();
      password = arg1.password || '';
      selectedRole = arg1.role || 'student';
    } else {
      identifier = String(arg1 || '').trim();
      password = String(arg2 || '');
      selectedRole = String(arg3 || 'student');
    }

    if (!identifier || !password) {
      setLoading(false);
      return {
        success: false,
        error: 'Please enter both your identifier and password.',
      };
    }

    if (selectedRole !== 'teacher' && selectedRole !== 'student') {
      setLoading(false);
      return {
        success: false,
        error: 'Invalid role. Supported roles are teacher and student.',
      };
    }

    try {
      const response = await api.post('/auth/login', {
        identifier,
        password,
        role: selectedRole,
      });

      const { data } = response;

      if (data.success && data.user) {
        // Store token and user details
        if (data.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
        setUser(data.user);
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        setLoading(false);
        return {
          success: false,
          error: data.message || 'Login failed. Please verify credentials.',
        };
      }
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        error: err.message || 'Server connection error during login.',
      };
    }
  };

  /**
   * Logout handler
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore network errors on logout
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: Boolean(user),
    loading,
    initialChecking,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
