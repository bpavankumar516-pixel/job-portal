// Auth Service simulating network requests with latency and local storage persistence
import {
  findUserByEmail,
  saveUserToDB,
  updateUserPassword,
  setCurrentUser,
  setAuthToken,
  removeCurrentUser,
  removeAuthToken,
  setRememberedInfo,
  removeRememberedInfo,
} from './localStorageService';

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  // Login
  async login({ email, password, role, rememberMe }) {
    await delay(500);

    const user = findUserByEmail(email);

    if (!user) {
      throw new Error('No account found with this email. Please check or register.');
    }

    if (user.password !== password) {
      throw new Error('Incorrect password. Please try again or reset your password.');
    }

    // Role check / alignment
    if (role && user.role !== role) {
      // Allow flexible switching or notify, but let's sync or alert
      // To provide best UX, we update or notify, or proceed with user's stored role
    }

    const token = `jwt_mock_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    // Create clean session user without password
    const sessionUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role || role || 'recruiter',
      avatar: user.avatar,
      headline: user.headline || '',
      company: user.company || '',
    };

    setCurrentUser(sessionUser);
    setAuthToken(token);

    if (rememberMe) {
      setRememberedInfo({ email: user.email, role: user.role });
    } else {
      removeRememberedInfo();
    }

    return { user: sessionUser, token };
  },

  // Register
  async register({ fullName, email, password, role = 'recruiter' }) {
    await delay(600);

    const existing = findUserByEmail(email);
    if (existing) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
      createdAt: new Date().toISOString(),
    };

    saveUserToDB(newUser);

    const token = `jwt_mock_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const sessionUser = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
    };

    setCurrentUser(sessionUser);
    setAuthToken(token);

    return { user: sessionUser, token };
  },

  // Logout
  async logout() {
    await delay(200);
    removeCurrentUser();
    removeAuthToken();
    return true;
  },

  // Forgot password check
  async requestPasswordReset(email) {
    await delay(500);
    const user = findUserByEmail(email);
    if (!user) {
      throw new Error('No registered account found with this email address.');
    }
    return {
      success: true,
      message: `Password reset instructions sent to ${email}`,
    };
  },

  // Reset password
  async resetPassword(email, newPassword) {
    await delay(500);
    const success = updateUserPassword(email, newPassword);
    if (!success) {
      throw new Error('User account could not be found to update password.');
    }
    return { success: true };
  },

  // Quick Social Login Demo
  async socialLogin(provider, selectedRole = 'recruiter') {
    await delay(400);

    const providerNames = {
      google: 'Google',
      linkedin: 'LinkedIn',
      github: 'GitHub',
    };

    const providerName = providerNames[provider] || 'Social';
    const email = `${provider}_user@jobportal.com`;

    let user = findUserByEmail(email);
    if (!user) {
      user = {
        id: `usr_${provider}_${Date.now()}`,
        fullName: `${providerName} Demo User`,
        email,
        password: 'Password@123',
        role: selectedRole,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${provider}`,
        createdAt: new Date().toISOString(),
      };
      saveUserToDB(user);
    }

    const token = `jwt_mock_${provider}_${Date.now()}`;
    const sessionUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: selectedRole || user.role,
      avatar: user.avatar,
    };

    setCurrentUser(sessionUser);
    setAuthToken(token);

    return { user: sessionUser, token, providerName };
  }
};
