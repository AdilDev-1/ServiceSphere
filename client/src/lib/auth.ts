// Client-side authentication with localStorage
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  profileImageUrl?: string | null;
}

// Hardcoded credentials
const CREDENTIALS = {
  'adil@gmail.com': {
    password: 'adil123',
    user: {
      id: '1',
      email: 'adil@gmail.com',
      firstName: 'Adil',
      lastName: 'User',
      role: 'user' as const,
      profileImageUrl: null
    }
  },
  'john@gmail.com': {
    password: 'admin123',
    user: {
      id: '2',
      email: 'john@gmail.com',
      firstName: 'John',
      lastName: 'Admin',
      role: 'admin' as const,
      profileImageUrl: null
    }
  }
};

const AUTH_STORAGE_KEY = 'autoservice_auth';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

interface AuthSession {
  user: User;
  expiresAt: number;
}

// Authentication functions
export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const credential = CREDENTIALS[email as keyof typeof CREDENTIALS];
  
  if (!credential || credential.password !== password) {
    return { success: false, error: 'Invalid email or password' };
  }

  const session: AuthSession = {
    user: credential.user,
    expiresAt: Date.now() + SESSION_DURATION
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  return { success: true, user: credential.user };
}

export function adminLogin(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const result = login(email, password);
  
  if (!result.success) {
    return result;
  }

  if (result.user?.role !== 'admin') {
    logout(); // Clear any session
    return { success: false, error: 'Access denied. Administrator privileges required.' };
  }

  return result;
}

export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getCurrentUser(): User | null {
  try {
    const sessionData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!sessionData) return null;

    const session: AuthSession = JSON.parse(sessionData);
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      logout();
      return null;
    }

    return session.user;
  } catch {
    logout();
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function requireAuth(): User {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user;
}

export function requireAdmin(): User {
  const user = requireAuth();
  if (user.role !== 'admin') {
    throw new Error('Administrator privileges required');
  }
  return user;
}