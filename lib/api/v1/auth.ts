import { getApiBase, getAuthHeaders, getToken, clearAuth, handleResponse, fetchApi } from '../base';
import type { User } from '../base';

export type { User };

type LoginResponse = { user: User; token: string; token_type: string };
type RegisterResponse = LoginResponse;

export type { LoginResponse, RegisterResponse };

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${getApiBase()}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({ email, password }).toString(),
  });
  return handleResponse<LoginResponse>(res);
}

export async function register(name: string, email: string, password: string, password_confirmation: string): Promise<RegisterResponse> {
  const res = await fetch(`${getApiBase()}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({ name, email, password, password_confirmation }).toString(),
  });
  return handleResponse<RegisterResponse>(res);
}

export async function logout(): Promise<void> {
  const token = getToken();
  if (token) {
    try {
      await fetch(`${getApiBase()}/api/logout`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
    } catch {
      // ignore
    }
  }
  clearAuth();
}

export async function me(): Promise<User> {
  return fetchApi<User>(`${getApiBase()}/api/me`, {
    headers: getAuthHeaders(),
  });
}
