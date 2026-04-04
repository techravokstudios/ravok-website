/**
 * API request/response types
 */

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status: number
}

// Auth
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: {
    id: number
    name: string
    email: string
    role: string
  }
  token?: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthUser {
  id: number
  name: string
  email: string
  role: string
  created_at?: string
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

// Contact/Waitlist
export interface ContactSubmission {
  name: string
  email: string
  partner_type: string
  message: string
}

export interface WaitlistSubmission {
  name: string
  email: string
  logline?: string
  portfolio_url?: string
}

// Portal Dashboard
export interface PortalDashboard {
  user: AuthUser
  portfolio_summary: {
    total_ventures: number
    capital_invested: number
    document_count: number
  }
  recent_updates: Array<{
    id: number
    title: string
    venture_name: string
    published_at: string
  }>
}

// Document Download
export interface DocumentDownload {
  download_url: string
  filename: string
  expires_at: string
}
