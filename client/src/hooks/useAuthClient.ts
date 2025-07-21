import { useState, useEffect } from 'react';
import { getCurrentUser, type User } from '@/lib/auth';

export function useAuthClient() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);

    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'autoservice_auth') {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const refreshAuth = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    refreshAuth
  };
}