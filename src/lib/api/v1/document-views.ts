import { getApiBase, getAuthHeaders, fetchApi } from '../base';

export type ViewSession = {
  session_id: string;
  started_at: string;
};

export type PageEvent = {
  page_number: number;
  entered_at: number;
  exited_at: number;
  duration_ms: number;
};

export async function startViewSession(documentId: number): Promise<ViewSession> {
  return fetchApi<ViewSession>(`${getApiBase()}/api/documents/${documentId}/views`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
}

export async function logPageEvents(sessionToken: string, events: PageEvent[]): Promise<{ status: string; count: number }> {
  return fetchApi<{ status: string; count: number }>(`${getApiBase()}/api/document-views/${sessionToken}/pages`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ events }),
  });
}

export async function endViewSession(sessionToken: string): Promise<{ status: string; total_duration_seconds: number; total_pages_viewed: number }> {
  return fetchApi<{ status: string; total_duration_seconds: number; total_pages_viewed: number }>(`${getApiBase()}/api/document-views/${sessionToken}/end`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
}
