'use client';

import {createContext, ReactNode, useContext, useEffect, useState} from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Safe localStorage helper
function safeLocalStorage() {
  const isAvailable = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  
  return {
    getItem: (key: string): string | null => {
      if (!isAvailable) return null;
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: (key: string, value: string): boolean => {
      if (!isAvailable) return false;
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },
    removeItem: (key: string): boolean => {
      if (!isAvailable) return false;
      try {
        localStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    }
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const storage = safeLocalStorage();

  useEffect(() => {
    // Check if user is already authenticated from localStorage
    const authStatus = storage.getItem('isAuthenticated');
    const authTime = storage.getItem('authTime');
    
    if (authStatus === 'true' && authTime) {
      const loginTime = new Date(authTime);
      const now = new Date();
      const hoursPassed = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      // Session expires after 1 hours
      if (hoursPassed < 1) {
        setIsAuthenticated(true);
      } else {
        storage.removeItem('isAuthenticated');
        storage.removeItem('authTime');
      }
    }
    
    setIsLoading(false);
  }, [storage]);

    const login = async (username: string = 'admin', password: string): Promise<boolean> => {
    try {
        console.log('Login attempt with username:', username);
        const response = await fetch('/api/auth/v2/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
            body: JSON.stringify({username: username, password: password}),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        // Try to set localStorage, but don't fail if it's not available
        storage.setItem('isAuthenticated', 'true');
        storage.setItem('authTime', new Date().toISOString());
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    
    // Clear localStorage safely
    storage.removeItem('isAuthenticated');
    storage.removeItem('authTime');
    
    // Clear server-side cookie
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout endpoint error:', error);
      // Continue with client-side logout even if server request fails
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}