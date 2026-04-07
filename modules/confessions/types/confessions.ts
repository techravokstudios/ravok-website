/**
 * Confession Types
 * Hollywood Confessions — anonymous user-generated content feature
 */

export type ConfessionStatus = 'pending' | 'approved' | 'rejected' | 'featured';

export type ConfessionCategory =
  | 'Development Hell'
  | 'Shady Accounting'
  | 'Gatekeeping'
  | 'Equity Theft'
  | 'The Waiting Game'
  | 'Festival Politics'
  | 'Streaming Nightmares'
  | 'Work For Hire Horror'
  | 'The Meeting That Changed Nothing'
  | 'General Confession';

/**
 * Confession entity returned from API
 */
export interface Confession {
  id: number;
  body: string; // max 500 chars
  category?: ConfessionCategory;
  status: ConfessionStatus;
  reactions: number; // heart/flame count
  featured_at?: string | null; // ISO timestamp
  amanda_response?: string | null; // Amanda's public take
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Request to submit a confession anonymously
 */
export interface ConfessionSubmitRequest {
  body: string; // required, max 500 chars
  category?: ConfessionCategory; // optional
  notify_email?: string; // optional email for notification when featured
}

/**
 * Featured confession with Amanda's response
 */
export interface FeaturedConfession extends Confession {
  amanda_response: string; // non-null on featured
}
