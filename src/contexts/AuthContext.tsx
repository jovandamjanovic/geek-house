'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated from localStorage
    const authStatus = localStorage.getItem('isAuthenticated');
    const authTime = localStorage.getItem('authTime');
    
    if (authStatus === 'true' && authTime) {
      const loginTime = new Date(authTime);
      const now = new Date();
      const hoursPassed = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      // Session expires after 1 hours
      if (hoursPassed < 1) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authTime');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authTime', new Date().toISOString());
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authTime');
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