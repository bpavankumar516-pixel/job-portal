// Local Storage Service for JobPortal System

const USER_KEY = 'jobportal_current_user';
const TOKEN_KEY = 'jobportal_auth_token';
const USERS_DB_KEY = 'jobportal_registered_users';
const REMEMBERED_KEY = 'jobportal_remembered_info';

// Seed demo users for instant testing
const DEFAULT_USERS = [
  {
    id: 'usr_recruiter_01',
    fullName: 'Pavan Kumar',
    email: 'recruiter@jobportal.com',
    password: 'Password@123',
    role: 'recruiter',
    company: 'TechCorp Solutions',
    headline: 'Senior Lead Recruiter',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_candidate_01',
    fullName: 'Alex Morgan',
    email: 'candidate@jobportal.com',
    password: 'Password@123',
    role: 'candidate',
    title: 'Senior React & Node Developer',
    headline: 'Full-Stack Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  }
];

export const initUsersDB = () => {
  const existing = localStorage.getItem(USERS_DB_KEY);
  if (!existing) {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(DEFAULT_USERS));
  } else {
    try {
      const users = JSON.parse(existing);
      const rec = users.find((u) => u.email === 'recruiter@jobportal.com');
      if (rec && rec.fullName !== 'Pavan Kumar') {
        rec.fullName = 'Pavan Kumar';
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      }
    } catch {
      // ignore
    }
  }

  // Update current session if logged in as recruiter
  try {
    const cur = localStorage.getItem(USER_KEY);
    if (cur) {
      const parsed = JSON.parse(cur);
      if (parsed.email === 'recruiter@jobportal.com' && parsed.fullName !== 'Pavan Kumar') {
        parsed.fullName = 'Pavan Kumar';
        localStorage.setItem(USER_KEY, JSON.stringify(parsed));
      }
    }
  } catch {
    // ignore
  }
};

export const getUsersDB = () => {
  initUsersDB();
  try {
    const data = localStorage.getItem(USERS_DB_KEY);
    return data ? JSON.parse(data) : DEFAULT_USERS;
  } catch (err) {
    console.error('Failed to parse users DB from localStorage', err);
    return DEFAULT_USERS;
  }
};

export const findUserByEmail = (email) => {
  if (!email) return null;
  const users = getUsersDB();
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
};

export const saveUserToDB = (newUser) => {
  const users = getUsersDB();
  const existingIndex = users.findIndex(
    (u) => u.email.toLowerCase() === newUser.email.trim().toLowerCase()
  );

  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...newUser };
  } else {
    users.push(newUser);
  }

  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  return newUser;
};

export const updateUserPassword = (email, newPassword) => {
  const users = getUsersDB();
  const index = users.findIndex(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (index >= 0) {
    users[index].password = newPassword;
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    return true;
  }
  return false;
};

export const getCurrentUser = () => {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

export const removeCurrentUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getRememberedInfo = () => {
  try {
    const data = localStorage.getItem(REMEMBERED_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setRememberedInfo = (info) => {
  if (info) {
    localStorage.setItem(REMEMBERED_KEY, JSON.stringify(info));
  } else {
    localStorage.removeItem(REMEMBERED_KEY);
  }
};

export const removeRememberedInfo = () => {
  localStorage.removeItem(REMEMBERED_KEY);
};
