import { fetchApi, getAuthHeaders, getApiBase } from '../base';

export type RoomStats = {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  expires_at: string | null;
  document_count: number;
  visitor_count: number;
  total_views: number;
  total_duration_seconds: number;
  created_at: string;
};

export type RoomDocStat = {
  id: number;
  name: string;
  total_views: number;
  unique_viewers: number;
  total_duration_seconds: number;
};

export type RoomDetail = {
  room: { id: number; name: string; slug: string; is_active: boolean; created_at: string };
  summary: { total_visitors: number; total_views: number; total_duration_seconds: number };
  document_stats: RoomDocStat[];
};

export type RoomVisitorStat = {
  id: number;
  name: string;
  email: string;
  last_accessed_at: string | null;
  total_views: number;
  total_duration_seconds: number;
};

export type RoomVisitorDetail = {
  visitor: { id: number; name: string; email: string; last_accessed_at: string | null };
  views: {
    id: number;
    document: { id: number; name: string };
    started_at: string;
    total_duration_seconds: number;
    total_pages_viewed: number;
    page_summary: { page_number: number; total_ms: number; visits: number }[];
  }[];
};

export async function getRoomAnalyticsList(): Promise<RoomStats[]> {
  return fetchApi<RoomStats[]>(`${getApiBase()}/api/analytics/rooms`, { headers: getAuthHeaders() });
}

export async function getRoomAnalyticsDetail(roomId: number): Promise<RoomDetail> {
  return fetchApi<RoomDetail>(`${getApiBase()}/api/analytics/rooms/${roomId}`, { headers: getAuthHeaders() });
}

export async function getRoomVisitors(roomId: number): Promise<RoomVisitorStat[]> {
  return fetchApi<RoomVisitorStat[]>(`${getApiBase()}/api/analytics/rooms/${roomId}/visitors`, { headers: getAuthHeaders() });
}

export async function getRoomVisitorDetail(roomId: number, visitorId: number): Promise<RoomVisitorDetail> {
  return fetchApi<RoomVisitorDetail>(`${getApiBase()}/api/analytics/rooms/${roomId}/visitors/${visitorId}`, { headers: getAuthHeaders() });
}
