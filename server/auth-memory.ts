// Hardcoded authentication for temporary setup
import type { Request, Response, NextFunction } from 'express';

// Hardcoded user credentials
const USERS = {
  'adil@gmail.com': {
    id: '1',
    email: 'adil@gmail.com',
    password: 'adil123',
    firstName: 'Adil',
    lastName: 'User',
    role: 'user',
    profileImageUrl: null
  },
  'john@gmail.com': {
    id: '2', 
    email: 'john@gmail.com',
    password: 'admin123',
    firstName: 'John',
    lastName: 'Admin',
    role: 'admin',
    profileImageUrl: null
  }
};

// In-memory session store
const sessions = new Map<string, any>();

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function authenticateUser(email: string, password: string) {
  const user = USERS[email as keyof typeof USERS];
  if (user && user.password === password) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}

export function createSession(user: any): string {
  const sessionId = generateSessionId();
  sessions.set(sessionId, {
    user,
    createdAt: Date.now(),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  });
  return sessionId;
}

export function getSession(sessionId: string) {
  const session = sessions.get(sessionId);
  if (session && session.expiresAt > Date.now()) {
    return session;
  }
  if (session) {
    sessions.delete(sessionId);
  }
  return null;
}

export function destroySession(sessionId: string) {
  sessions.delete(sessionId);
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies?.sessionId;
  
  if (!sessionId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const session = getSession(sessionId);
  if (!session) {
    res.clearCookie('sessionId');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  (req as any).user = session.user;
  next();
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies?.sessionId;
  
  if (!sessionId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const session = getSession(sessionId);
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
  }

  (req as any).user = session.user;
  next();
}