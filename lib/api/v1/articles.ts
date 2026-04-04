import { apiClient } from '../client';
import { Article } from '@/lib/types/articles';
import { PaginatedResponse } from '@/lib/types/common';

export const articlesApi = {
  /**
   * Get paginated list of published articles (public)
   */
  async getPublished(page = 1, limit = 6): Promise<PaginatedResponse<Article>> {
    const response = await apiClient.get<PaginatedResponse<Article>>(
      '/articles',
      {
        params: { page, limit, status: 'published' },
      }
    );
    return response.data;
  },

  /**
   * Get a single article by slug
   */
  async getBySlug(slug: string): Promise<Article> {
    const response = await apiClient.get<Article>(`/articles/${slug}`);
    return response.data;
  },

  /**
   * Get articles filtered by category
   */
  async getByCategory(
    category: string,
    page = 1,
    limit = 6
  ): Promise<PaginatedResponse<Article>> {
    const response = await apiClient.get<PaginatedResponse<Article>>(
      '/articles',
      {
        params: { page, limit, category, status: 'published' },
      }
    );
    return response.data;
  },

  /**
   * Search articles by keyword
   */
  async search(query: string, page = 1, limit = 6): Promise<PaginatedResponse<Article>> {
    const response = await apiClient.get<PaginatedResponse<Article>>(
      '/articles/search',
      {
        params: { q: query, page, limit },
      }
    );
    return response.data;
  },

  /**
   * Get admin list of all articles (draft, published, etc.)
   */
  async getAdminList(
    page = 1,
    limit = 20,
    status?: 'draft' | 'published' | 'archived'
  ): Promise<PaginatedResponse<Article>> {
    const response = await apiClient.get<PaginatedResponse<Article>>(
      '/admin/articles',
      {
        params: { page, limit, ...(status && { status }) },
      }
    );
    return response.data;
  },

  /**
   * Create a new article (admin)
   */
  async create(data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category?: string;
    featured_image_url?: string;
  }): Promise<Article> {
    const response = await apiClient.post<Article>('/admin/articles', data);
    return response.data;
  },

  /**
   * Update an article (admin)
   */
  async update(
    id: number,
    data: Partial<{
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      category?: string;
      featured_image_url?: string;
      status: 'draft' | 'published' | 'archived';
    }>
  ): Promise<Article> {
    const response = await apiClient.put<Article>(`/admin/articles/${id}`, data);
    return response.data;
  },

  /**
   * Publish an article (admin)
   */
  async publish(id: number): Promise<Article> {
    const response = await apiClient.put<Article>(`/admin/articles/${id}/publish`);
    return response.data;
  },

  /**
   * Delete an article (admin)
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/admin/articles/${id}`);
  },
};
