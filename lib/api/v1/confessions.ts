import { apiClient } from '../client';
import { Confession, ConfessionSubmitRequest } from '@/lib/types/confessions';
import { PaginatedResponse } from '@/lib/types/common';

export const confessionsApi = {
  /**
   * Get paginated feed of approved confessions (public)
   */
  async getFeed(page = 1, limit = 12): Promise<PaginatedResponse<Confession>> {
    const response = await apiClient.get<PaginatedResponse<Confession>>(
      '/confessions',
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  /**
   * Get featured confessions with Amanda's responses (public)
   */
  async getFeatured(limit = 5): Promise<Confession[]> {
    const response = await apiClient.get<Confession[]>(
      '/confessions/featured',
      {
        params: { limit },
      }
    );
    return response.data;
  },

  /**
   * Submit a confession anonymously (rate-limited by IP)
   */
  async submit(confession: ConfessionSubmitRequest): Promise<Confession> {
    const response = await apiClient.post<Confession>(
      '/confessions',
      confession
    );
    return response.data;
  },

  /**
   * Add a reaction to a confession (rate-limited by IP hash)
   */
  async react(confessionId: number): Promise<Confession> {
    const response = await apiClient.post<Confession>(
      `/confessions/${confessionId}/react`
    );
    return response.data;
  },

  /**
   * Get all confessions for admin moderation queue
   */
  async getAdminQueue(
    page = 1,
    limit = 20,
    status?: 'pending' | 'approved' | 'rejected' | 'featured'
  ): Promise<PaginatedResponse<Confession>> {
    const response = await apiClient.get<PaginatedResponse<Confession>>(
      '/admin/confessions',
      {
        params: { page, limit, ...(status && { status }) },
      }
    );
    return response.data;
  },

  /**
   * Update confession status (approve, reject, feature)
   */
  async updateStatus(
    confessionId: number,
    status: 'pending' | 'approved' | 'rejected' | 'featured'
  ): Promise<Confession> {
    const response = await apiClient.put<Confession>(
      `/admin/confessions/${confessionId}/status`,
      { status }
    );
    return response.data;
  },

  /**
   * Add Amanda's public response to a confession
   */
  async addResponse(
    confessionId: number,
    response: string
  ): Promise<Confession> {
    const apiResponse = await apiClient.put<Confession>(
      `/admin/confessions/${confessionId}/respond`,
      { amanda_response: response }
    );
    return apiResponse.data;
  },
};
