'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { AuthUser } from '../types'
import { AppError } from '../error/AppError'

export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isInvestor: boolean
  login: (email: string, password: string) => Promise<unknown>
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) => Promise<AuthUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        loading: auth.loading,
        isAuthenticated: auth.isAuthenticated,
        isAdmin: auth.isAdmin,
        isInvestor: auth.isInvestor,
        login: auth.login,
        register: auth.register,
        logout: auth.logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

export function ProtectedRoute({ children, requiredRole }: { children: ReactNode; requiredRole?: string }) {
  const { isAuthenticated, loading, user } = useAuthContext()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <div className="flex items-center justify-center min-h-screen">Insufficient Permissions</div>
  }

  return <>{children}</>
}
