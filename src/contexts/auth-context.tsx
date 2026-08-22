import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import * as authService from '@/services/auth';
import { ApiError } from '@/services/api';
import type { AuthUser, RegisterPayload } from '@/services/auth';
import { tokenStorage } from '@/utils/token-storage';

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (login: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    tokenStorage
      .getSession<AuthUser>()
      .then((session) => {
        if (session) {
          setUser(session.user);
          setToken(session.token);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: token !== null,
      async login(login: string, password: string) {
        const response = await authService.login(login, password);
        await tokenStorage.saveSession(response.token, response.user);
        setUser(response.user);
        setToken(response.token);
      },
      async register(payload: RegisterPayload) {
        const response = await authService.register(payload);
        await tokenStorage.saveSession(response.token, response.user);
        setUser(response.user);
        setToken(response.token);
      },
      async logout() {
        try {
          if (token) {
            await authService.logout(token);
          }
        } catch (error) {
          if (!(error instanceof ApiError)) {
            throw error;
          }
        } finally {
          await tokenStorage.clearSession();
          setUser(null);
          setToken(null);
        }
      },
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  }
  return context;
}
