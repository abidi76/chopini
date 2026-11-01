'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../lib/api';

export type User = { id: string; email: string; name: string; phone: string | null; city: string | null; role: string };

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string; city?: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    api<User>('/auth/me')
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const authenticate = useCallback(async (path: string, body: unknown) => {
    const r = await api<{ user: User; accessToken: string }>(path, { method: 'POST', body: JSON.stringify(body) });
    setToken(r.accessToken);
    setUser(r.user);
  }, []);

  const value: AuthState = {
    user,
    loading,
    login: (email, password) => authenticate('/auth/login', { email, password }),
    register: (data) => authenticate('/auth/register', data),
    logout: () => {
      setToken(null);
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
}
