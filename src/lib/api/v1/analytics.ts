import { fetchApi, getAuthHeaders, getApiBase } from '../base';

export type DocumentStats = {
  id: number;
  name: string;
  category: string | null;
  mime_type: string;
  created_at: string;
  total_views: number;
  unique_viewers: number;
  total_duration_seconds: number;
  last_viewed_at: string | null;
};

export type ViewerEntry = {
  id: number;
  session_token: string;
  user: { id: number; name: string; email: string } | null;
  started_at: string;
  ended_at: string | null;
  total_duration_seconds: number;
  total_pages_viewed: number;
  ip_address: string | null;
  user_agent: string | null;
  location: string | null;
};

export type PageStat = {
  page_number: number;
  view_count: number;
  total_ms: number;
  avg_ms: number;
};

export type DocumentDetail = {
  document: {
    id: number;
    name: string;
    category: string | null;
    mime_type: string;
    created_at: string;
  };
  summary: {
    total_views: number;
    unique_viewers: number;
    total_duration_seconds: number;
    avg_duration_seconds: number;
  };
  views: ViewerEntry[];
  page_stats: PageStat[];
};

export type PageViewEvent = {
  page_number: number;
  entered_at: number;
  exited_at: number;
  duration_ms: number;
};

export type PageSummaryEntry = {
  page_number: number;
  total_ms: number;
  visits: number;
};

export type ViewDetail = {
  view: ViewerEntry & {
    document: { id: number; name: string };
  };
  page_views: PageViewEvent[];
  page_summary: PageSummaryEntry[];
};

export async function getDocumentAnalytics(): Promise<DocumentStats[]> {
  return fetchApi<DocumentStats[]>(`${getApiBase()}/api/analytics/documents`, {
    headers: getAuthHeaders(),
  });
}

export async function getDocumentAnalyticsDetail(documentId: number): Promise<DocumentDetail> {
  return fetchApi<DocumentDetail>(`${getApiBase()}/api/analytics/documents/${documentId}`, {
    headers: getAuthHeaders(),
  });
}

export async function exportDocumentAnalyticsCsv(documentId: number): Promise<Blob> {
  const res = await fetch(`${getApiBase()}/api/analytics/documents/${documentId}/export`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Export failed");
  return res.blob();
}

export async function getViewDetail(sessionToken: string): Promise<ViewDetail> {
  return fetchApi<ViewDetail>(`${getApiBase()}/api/analytics/views/${sessionToken}`, {
    headers: getAuthHeaders(),
  });
}
