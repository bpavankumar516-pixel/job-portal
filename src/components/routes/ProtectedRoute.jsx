import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FD663F] flex items-center justify-center text-white shadow-lg shadow-[#FD663F]/30 animate-pulse mb-4">
          <svg
            className="w-7 h-7 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.25" />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="white"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-[#25324B]">
          Authenticating JobPortal session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
