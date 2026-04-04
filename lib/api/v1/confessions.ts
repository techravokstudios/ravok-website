import { ApiClient } from '../client'
import { API_ENDPOINTS } from '../../config/endpoints'
import {
  Confession,
  ConfessionCategory,
  ApiResponse,
  PaginatedResponse,
} from '../../types'

export interface ConfessionSubmissionData {
  body: string
  category?: ConfessionCategory
  submitted_from?: string // IP address or anon identifier
  notify_email?: string
}

export interface ConfessionModerationData {
  status: 'approved' | 'rejected' | 'featured'
  response?: string
}

export const confessionsApi = {
  // Public endpoints
  getConfessions: async (
    page: number = 1,
    perPage: number = 10,
    category?: string,
    featured: boolean = false
  ): Promise<PaginatedResponse<Confession>> => {
    const response = await ApiClient.get<ApiResponse<PaginatedResponse<Confession>>>(
      API_ENDPOINTS.PUBLIC.CONFESSIONS,
      { params: { page, per_page: perPage, category, featured } }
    )
    return response.data.data
  },

  submitConfession: async (data: ConfessionSubmissionData): Promise<Confession> => {
    const response = await ApiClient.post<ApiResponse<Confession>>(
      API_ENDPOINTS.PUBLIC.CONFESSIONS,
      data
    )
    return response.data.data
  },

  // Admin endpoints
  getAdminConfessions: async (
    page: number = 1,
    perPage: number = 10,
    status?: string
  ): Promise<PaginatedResponse<Confession>> => {
    const response = await ApiClient.get<ApiResponse<PaginatedResponse<Confession>>>(
      API_ENDPOINTS.ADMIN.CONFESSIONS,
      { params: { page, per_page: perPage, status } }
    )
    return response.data.data
  },

  moderateConfession: async (id: number, data: ConfessionModerationData): Promise<Confession> => {
    const response = await ApiClient.put<ApiResponse<Confession>>(
      `${API_ENDPOINTS.ADMIN.CONFESSIONS}/${id}`,
      data
    )
    return response.data.data
  },

  deleteConfession: async (id: number): Promise<void> => {
    await ApiClient.delete(`${API_ENDPOINTS.ADMIN.CONFESSIONS}/${id}`)
  },
}
