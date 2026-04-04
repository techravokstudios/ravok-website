'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ApiClient } from '../api/client'
import { authApi } from '../api/v1'
import { AuthUser } from '../types'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = ApiClient.getAuthToken()
      if (token) {
        try {
          const currentUser = await authApi.getCurrentUser()
          setUser(currentUser)
          setIsAuthenticated(true)
        } catch {
          // Token is invalid
          ApiClient.clearAuth()
          setUser(null)
          setIsAuthenticated(false)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password })
      if (response.token) {
        ApiClient.setAuthToken(response.token)
      }
      setUser(response.user)
      setIsAuthenticated(true)
      return response
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
      throw error
    }
  }

  const register = async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
    try {
      const user = await authApi.register(data)
      setUser(user)
      setIsAuthenticated(true)
      return user
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      router.push('/login')
    }
  }

  const isAdmin = user?.role === 'admin'
  const isInvestor = user?.role === 'investor'

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    isAdmin,
    isInvestor,
  }
}
