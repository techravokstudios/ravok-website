/**
 * Article/Blog Types
 * For insights/blog section
 */

export type ArticleStatus = 'draft' | 'published' | 'archived';

/**
 * Article entity from API
 */
export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Rich HTML content
  category?: string;
  featured_image_url?: string;
  status: ArticleStatus;
  author_id?: number;
  author?: {
    id: number;
    name: string;
    email: string;
  };
  view_count?: number;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  published_at?: string; // ISO timestamp
}

/**
 * Article for listing (excerpt version)
 */
export interface ArticleListItem
  extends Pick<
    Article,
    'id' | 'title' | 'slug' | 'excerpt' | 'category' | 'featured_image_url' | 'created_at'
  > {
  author?: string;
  read_time_minutes?: number;
}
