import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import {
  getCurrentUser,
  getAuthToken,
  getRememberedInfo,
  initUsersDB,
} from '../services/localStorageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState('recruiter'); // 'recruiter' | 'candidate'
  const [remembered, setRemembered] = useState(null);

  // Initialize DB and restore session on mount
  useEffect(() => {
    initUsersDB();
    const storedUser = getCurrentUser();
    const storedToken = getAuthToken();
    const remInfo = getRememberedInfo();

    if (remInfo) {
      setRemembered(remInfo);
      if (remInfo.role) {
        setActiveRole(remInfo.role);
      }
    }

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
      if (storedUser.role) {
        setActiveRole(storedUser.role);
      }
    }

    setLoading(false);
  }, []);

  // Login handler
  const login = async ({ email, password, role, rememberMe }) => {
    try {
      const targetRole = role || activeRole;
      const result = await authService.login({
        email,
        password,
        role: targetRole,
        rememberMe,
      });

      setUser(result.user);
      setToken(result.token);
      setActiveRole(result.user.role);

      toast.success(`Welcome back, ${result.user.fullName}!`, {
        icon: '👋',
      });

      return result.user;
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      throw error;
    }
  };

  // Register handler
  const register = async ({ fullName, email, password, role }) => {
    try {
      const targetRole = role || activeRole;
      const result = await authService.register({
        fullName,
        email,
        password,
        role: targetRole,
      });

      setUser(result.user);
      setToken(result.token);
      setActiveRole(result.user.role);

      toast.success(`Account created successfully! Welcome to JobPortal.`, {
        icon: '🎉',
      });

      return result.user;
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
      toast.info('You have been safely logged out.');
    } catch (error) {
      toast.error('Logout error. Please try again.');
    }
  };

  // Social Login handler
  const socialLogin = async (provider, role) => {
    try {
      const targetRole = role || activeRole;
      const result = await authService.socialLogin(provider, targetRole);
      setUser(result.user);
      setToken(result.token);
      setActiveRole(result.user.role);

      toast.success(`Signed in with ${result.providerName}!`, {
        icon: '🚀',
      });

      return result.user;
    } catch (error) {
      toast.error(error.message || `Failed to sign in with ${provider}`);
      throw error;
    }
  };

  // Forgot password
  const requestPasswordReset = async (email) => {
    try {
      const result = await authService.requestPasswordReset(email);
      toast.success('Password reset link sent to your email!');
      return result;
    } catch (error) {
      toast.error(error.message || 'Unable to request password reset.');
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email, newPassword) => {
    try {
      const result = await authService.resetPassword(email, newPassword);
      toast.success('Password updated successfully! You can now log in.');
      return result;
    } catch (error) {
      toast.error(error.message || 'Unable to update password.');
      throw error;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    role: activeRole,
    setActiveRole,
    loading,
    remembered,
    login,
    register,
    logout,
    socialLogin,
    requestPasswordReset,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
