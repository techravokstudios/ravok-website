// Shared API utilities — base HTTP layer
// All v1 endpoint modules import from this file.

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "investor";
  status: "pending" | "approved" | "rejected";
  profile?: { id: number; user_id: number; phone: string | null; avatar: string | null; bio: string | null };
};

const AUTH_TOKEN_KEY = "ravok_token";
const AUTH_USER_KEY = "ravok_user";

export function getApiBase(): string {
  const envRaw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (envRaw) {
    const cleaned = envRaw.replace(/\/+$/, "").replace(/\.$/, "");
    return cleaned;
  }
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    try {
      const url = new URL(origin);
      const host = url.hostname;
      if (host.endsWith("ravokstudios.com")) {
        return "";
      }
    } catch {
      // ignore parse errors
    }
    if (origin !== "http://localhost:3000" && origin !== "http://127.0.0.1:3000") {
      return origin;
    }
  }
  return "http://localhost:8000";
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuth(token: string, user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const NETWORK_ERROR_MSG =
  "Cannot connect to server. Please check your connection. If you're on the live site, the API may be unavailable—try again later or contact support.";

export async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data as { message?: string })?.message || res.statusText;
    throw new Error(Array.isArray(message) ? message[0] : message);
  }
  return data as T;
}

export async function fetchApi<T>(url: string, init: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, init);
    return await handleResponse<T>(res);
  } catch (err) {
    if (err instanceof TypeError && (err.message === "Failed to fetch" || err.message === "Load failed")) {
      throw new Error(NETWORK_ERROR_MSG);
    }
    throw err;
  }
}
