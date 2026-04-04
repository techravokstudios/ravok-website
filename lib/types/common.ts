/**
 * Common API & utility types
 */

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

/**
 * Generic result type for operations
 */
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * Pagination params
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}
