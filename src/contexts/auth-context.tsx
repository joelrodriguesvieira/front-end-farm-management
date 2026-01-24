'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/src/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar se há token ao montar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      checkAuth();
    }
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const userData = await authService.me();
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error('Erro ao verificar autenticação:', err);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const { token } = await authService.login(email, password);
      setToken(token);
      const userData = await authService.me();
      setUser(userData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.register(userData);
      // Fazer login automaticamente após registro
      await login(userData.email || '', userData.password);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao registrar';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider');
  }
  return context;
}
