'use client';

/**
 * Auth context shell — placeholder for future centralized auth state.
 * Currently auth uses Google login with per-page checks.
 * This context will wrap the app when we migrate to centralized auth.
 */

import { createContext, useContext, type ReactNode } from 'react';

interface AuthContextType {
  // Placeholder — actual shape will be defined during auth migration
  user: null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // Passthrough for now — no behavior change
  return (
    <AuthContext.Provider value={{ user: null, isAuthenticated: false, isLoading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
