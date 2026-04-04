/**
 * Axios HTTP client with Sanctum cookie-based authentication
 * Configured to work with Laravel 12 backend
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://ravokbackend-production.up.railway.app/api';

/**
 * Create and configure Axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Include cookies for Sanctum auth
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request interceptor
 * Add CSRF token if available, handle auth headers
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get CSRF token from cookie if needed (for session-based requests)
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor
 * Handle errors globally (401 → redirect to login, etc.)
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized — redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Utility: Get cookie value by name
 */
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
}

export { apiClient };
