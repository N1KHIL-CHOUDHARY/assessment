'use client';

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, LoginPayload, RegisterPayload, AuthState } from '@/types';
import { authApi, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '@/lib/api';

export interface AuthContextType extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    setUser(null);
    setToken(null);
  }, []);

  // Validate token on startup with /api/auth/me
  const validateAuth = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    setToken(savedToken);

    try {
      const currentUser = await authApi.getMe();
      setUser(currentUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } catch (error) {
      console.warn('Auth token validation failed, clearing session:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    // Initial localstorage recovery
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) setToken(storedToken);
    } catch {}

    validateAuth();

    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener('cognibloom_auth_expired', handleAuthExpired);
    return () => {
      window.removeEventListener('cognibloom_auth_expired', handleAuthExpired);
    };
  }, [validateAuth, logout]);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const { user: loggedInUser, token: authToken } = await authApi.login(payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
      }
      setToken(authToken);
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const { user: registeredUser, token: authToken } = await authApi.register(payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(registeredUser));
      }
      setToken(authToken);
      setUser(registeredUser);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authApi.getMe();
      setUser(currentUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, token, isLoading, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
