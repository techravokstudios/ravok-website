import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import { AppError } from '../error/AppError'

const getApiUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  }
  // Client-side
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
}

class ApiClient {
  private static instance: AxiosInstance | null = null
  private static accessToken: string | null = null

  static getInstance(): AxiosInstance {
    if (!this.instance) {
      const baseURL = getApiUrl()

      this.instance = axios.create({
        baseURL,
        withCredentials: true, // For Sanctum cookie-based auth
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })

      // Request interceptor: Attach auth token if available
      this.instance.interceptors.request.use(
        (config) => {
          if (this.accessToken) {
            config.headers.Authorization = `Bearer ${this.accessToken}`
          }
          return config
        },
        (error) => Promise.reject(error)
      )

      // Response interceptor: Handle 401, transform errors
      this.instance.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
          if (error.response?.status === 401) {
            // Clear token and redirect to login
            this.setAuthToken(null)
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
          }

          // Transform axios error to AppError
          const responseData = error.response?.data as Record<string, unknown> | undefined
          const appError = new AppError(
            (responseData?.message as string) || error.message || 'Unknown error',
            error.response?.status || 500,
            responseData
          )

          return Promise.reject(appError)
        }
      )
    }

    return this.instance
  }

  static setAuthToken(token: string | null): void {
    this.accessToken = token
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  static getAuthToken(): string | null {
    if (this.accessToken) return this.accessToken

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth_token')
      if (stored) {
        this.accessToken = stored
      }
    }

    return this.accessToken
  }

  static clearAuth(): void {
    this.setAuthToken(null)
  }

  static async get<T>(url: string, config?: AxiosRequestConfig) {
    return this.getInstance().get<T>(url, config)
  }

  static async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.getInstance().post<T>(url, data, config)
  }

  static async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.getInstance().put<T>(url, data, config)
  }

  static async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.getInstance().patch<T>(url, data, config)
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.getInstance().delete<T>(url, config)
  }
}

export { ApiClient, getApiUrl }
