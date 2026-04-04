/**
 * Business model types — correspond to backend Eloquent models
 */

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export type UserRole = 'admin' | 'investor' | 'partner' | 'user'

export interface Venture {
  id: number
  name: string
  slug: string
  type: VentureType
  status: VentureStatus
  logline?: string
  genre?: string
  budget_low?: number
  budget_high?: number
  capital_raised: number
  equity_allocated: number
  target_return?: string
  hero_image?: string
  created_at: string
  updated_at: string
}

export type VentureType = 'film_spv' | 'production_label' | 'tech_venture'
export type VentureStatus =
  | 'concept'
  | 'development'
  | 'financing'
  | 'production'
  | 'distribution'
  | 'released'
  | 'exited'

export interface VentureMember {
  id: number
  venture_id: number
  name: string
  role: string
  bio?: string
  headshot?: string
  created_at: string
  updated_at: string
}

export interface Document {
  id: number
  title: string
  category: DocumentCategory
  venture_id?: number
  file_path: string
  file_size: number
  uploaded_by: number
  visibility: DocumentVisibility
  requires_signature: boolean
  created_at: string
  updated_at: string
}

export type DocumentCategory =
  | 'pitch_deck'
  | 'financial'
  | 'legal'
  | 'quarterly'
  | 'board'
  | 'diligence'
  | 'general'

export type DocumentVisibility = 'all_investors' | 'specific' | 'partners'

export interface Update {
  id: number
  title: string
  body: string
  venture_id?: number
  visibility: UpdateVisibility
  sent_email: boolean
  published_at: string
  created_at: string
  updated_at: string
}

export type UpdateVisibility = 'all' | 'investors_only' | 'partners_only'

export interface Article {
  id: number
  title: string
  slug: string
  body: string
  excerpt?: string
  featured_image?: string
  author_id: number
  status: ArticleStatus
  published_at?: string
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
}

export type ArticleStatus = 'draft' | 'published' | 'archived'

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface Confession {
  id: number
  body: string
  category?: ConfessionCategory
  status: ConfessionStatus
  reactions: number
  featured_at?: string | null
  amanda_response?: string | null
  created_at: string
  updated_at: string
}

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
  | 'General Confession'

export type ConfessionStatus = 'pending' | 'approved' | 'rejected' | 'featured'

export interface Contact {
  id: number
  name: string
  email: string
  partner_type: PartnerType
  message: string
  responded: boolean
  created_at: string
  updated_at: string
}

export type PartnerType = 'co_producer' | 'financier' | 'distributor' | 'operator' | 'creator' | 'other'

export interface Waitlist {
  id: number
  name: string
  email: string
  logline?: string
  portfolio_url?: string
  created_at: string
}
