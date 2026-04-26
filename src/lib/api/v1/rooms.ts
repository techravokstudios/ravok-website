import { fetchApi, getAuthHeaders, getApiBase } from '../base';

// --- Admin API (Sanctum auth) ---

export type DataRoom = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  nda_text?: string | null;
  is_active: boolean;
  expires_at: string | null;
  allow_download: boolean;
  notify_on_visit: boolean;
  created_at: string;
  visitors_count?: number;
  documents_count?: number;
  views_count?: number;
};

export type DataRoomDetail = DataRoom & {
  documents: { id: number; name: string; original_name: string | null; mime_type: string; size_bytes: number; pivot: { sort_order: number } }[];
  visitors: { id: number; name: string; email: string; last_accessed_at: string | null }[];
};

export async function listRooms(): Promise<DataRoom[]> {
  return fetchApi<DataRoom[]>(`${getApiBase()}/api/rooms`, { headers: getAuthHeaders() });
}

export async function getRoom(id: number): Promise<DataRoomDetail> {
  return fetchApi<DataRoomDetail>(`${getApiBase()}/api/rooms/${id}`, { headers: getAuthHeaders() });
}

export async function createRoom(data: {
  name: string;
  description?: string;
  nda_text?: string;
  passcode?: string;
  expires_at?: string;
  allow_download?: boolean;
  notify_on_visit?: boolean;
  document_ids?: number[];
}): Promise<DataRoom> {
  return fetchApi<DataRoom>(`${getApiBase()}/api/rooms`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export async function updateRoom(id: number, data: Partial<{
  name: string;
  description: string | null;
  nda_text: string | null;
  passcode: string | null;
  expires_at: string | null;
  is_active: boolean;
  allow_download: boolean;
  notify_on_visit: boolean;
}>): Promise<DataRoom> {
  return fetchApi<DataRoom>(`${getApiBase()}/api/rooms/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteRoom(id: number): Promise<void> {
  await fetchApi(`${getApiBase()}/api/rooms/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
}

export async function addRoomDocuments(roomId: number, documentIds: number[]): Promise<DataRoomDetail> {
  return fetchApi<DataRoomDetail>(`${getApiBase()}/api/rooms/${roomId}/documents`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ document_ids: documentIds }),
  });
}

export async function quickShareDocument(documentId: number): Promise<DataRoom> {
  return fetchApi<DataRoom>(`${getApiBase()}/api/documents/${documentId}/quick-share`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
}

export async function removeRoomDocument(roomId: number, documentId: number): Promise<void> {
  await fetchApi(`${getApiBase()}/api/rooms/${roomId}/documents/${documentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

// --- Public API (no Sanctum, uses X-Room-Token) ---

const ROOM_TOKEN_PREFIX = 'ravok_room_';

export function getRoomToken(slug: string): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(`${ROOM_TOKEN_PREFIX}${slug}`);
}

export function setRoomToken(slug: string, token: string): void {
  sessionStorage.setItem(`${ROOM_TOKEN_PREFIX}${slug}`, token);
}

export function getRoomVisitorEmail(slug: string): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(`${ROOM_TOKEN_PREFIX}${slug}_email`);
}

export function setRoomVisitorEmail(slug: string, email: string): void {
  sessionStorage.setItem(`${ROOM_TOKEN_PREFIX}${slug}_email`, email);
}

function roomHeaders(slug: string): Record<string, string> {
  const token = getRoomToken(slug);
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { 'X-Room-Token': token } : {}),
  };
}

export type PublicRoomInfo = {
  name: string;
  description: string | null;
  nda_text: string | null;
  requires_passcode: boolean;
  requires_nda: boolean;
  is_expired: boolean;
  is_active: boolean;
  document_count: number;
};

export async function getPublicRoomInfo(slug: string): Promise<PublicRoomInfo> {
  return fetchApi<PublicRoomInfo>(`${getApiBase()}/api/public/rooms/${slug}`, {
    headers: { Accept: 'application/json' },
  });
}

export async function enterRoom(slug: string, data: { email: string; name: string; passcode?: string; accept_nda?: boolean }): Promise<{
  access_token: string;
  visitor: { id: number; name: string; email: string };
}> {
  return fetchApi(`${getApiBase()}/api/public/rooms/${slug}/enter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });
}

export type PublicRoomDocument = {
  id: number;
  name: string;
  mime_type: string;
  size_bytes: number;
};

export async function getPublicRoomDocuments(slug: string): Promise<{
  room: { name: string; allow_download: boolean };
  documents: PublicRoomDocument[];
}> {
  return fetchApi(`${getApiBase()}/api/public/rooms/${slug}/documents`, {
    headers: roomHeaders(slug),
  });
}

export function publicRoomFileUrl(slug: string, documentId: number): string {
  return `${getApiBase()}/api/public/rooms/${slug}/documents/${documentId}/file`;
}

export async function startRoomViewSession(slug: string, documentId: number): Promise<{ session_id: string; started_at: string }> {
  return fetchApi(`${getApiBase()}/api/public/rooms/${slug}/documents/${documentId}/views`, {
    method: 'POST',
    headers: roomHeaders(slug),
  });
}

export async function logRoomPageEvents(slug: string, sessionToken: string, events: { page_number: number; entered_at: number; exited_at: number; duration_ms: number }[]): Promise<{ status: string; count: number }> {
  return fetchApi(`${getApiBase()}/api/public/room-views/${sessionToken}/pages`, {
    method: 'POST',
    headers: roomHeaders(slug),
    body: JSON.stringify({ events }),
  });
}

export async function endRoomViewSession(slug: string, sessionToken: string): Promise<{ status: string }> {
  return fetchApi(`${getApiBase()}/api/public/room-views/${sessionToken}/end`, {
    method: 'POST',
    headers: roomHeaders(slug),
  });
}
