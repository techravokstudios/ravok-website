import { getApiBase, getAuthHeaders, fetchApi } from '../base';
import type { User } from '../base';

export type UserListResponse = { data: User[]; current_page: number; last_page: number; per_page: number; total: number };

export async function getUsers(params?: { role?: string; status?: string; page?: number }): Promise<UserListResponse> {
  const search = new URLSearchParams();
  if (params?.role) search.set("role", params.role);
  if (params?.status) search.set("status", params.status);
  if (params?.page) search.set("page", String(params.page));
  const q = search.toString();
  return fetchApi<UserListResponse>(`${getApiBase()}/api/users${q ? `?${q}` : ""}`, {
    headers: getAuthHeaders(),
  });
}

export async function getUser(id: number): Promise<User> {
  return fetchApi<User>(`${getApiBase()}/api/users/${id}`, {
    headers: getAuthHeaders(),
  });
}

export async function approveUser(id: number): Promise<User> {
  return fetchApi<User>(`${getApiBase()}/api/users/${id}/approve`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
}

export async function rejectUser(id: number): Promise<User> {
  return fetchApi<User>(`${getApiBase()}/api/users/${id}/reject`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
}
