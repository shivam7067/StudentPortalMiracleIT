import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRole, children }) {
  const { isAuthenticated, role, initialChecking } = useAuth();
  const location = useLocation();

  if (initialChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login while preserving attempted path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // If a teacher tries to access student routes or student tries to access teacher routes
    if (role === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />;
    } else if (role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
