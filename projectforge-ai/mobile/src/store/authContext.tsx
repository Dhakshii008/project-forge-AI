// ProjectForge AI — Mobile Authentication Context & State
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { storage } from '../services/storage';
import { authService } from '../services/authService';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
  college?: string;
  department?: string;
  year?: string;
  skills?: string[];
  careerGoal?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (emailOrCreds: string | { email: string; password: string }, maybePassword?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = async () => {
    try {
      setIsLoading(true);
      const savedToken = await storage.getToken();
      const savedUser = await storage.getUser();

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);

        // Verify with backend in background
        authService.getMe().then((res) => {
          if (res.success && res.data?.user) {
            setUser(res.data.user);
            storage.setUser(res.data.user);
          } else if (res.error?.code === 'TOKEN_EXPIRED' || res.error?.code === 'UNAUTHORIZED') {
            storage.clearSession();
            setToken(null);
            setUser(null);
          }
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('[AuthContext] Session restore error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (
    emailOrCreds: string | { email: string; password: string },
    maybePassword?: string
  ) => {
    setIsLoading(true);
    try {
      const credentials =
        typeof emailOrCreds === 'string'
          ? { email: emailOrCreds, password: maybePassword || '' }
          : emailOrCreds;

      const res = await authService.login(credentials);
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: false, error: res.error?.message || 'Login failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error during login' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data as any);
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      return { success: false, error: res.error?.message || 'Registration failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error during registration' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    const res = await authService.getMe();
    if (res.success && res.data?.user) {
      setUser(res.data.user);
      await storage.setUser(res.data.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: Boolean(token && user),
        login,
        register,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
