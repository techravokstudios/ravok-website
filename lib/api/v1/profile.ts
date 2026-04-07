import { getApiBase, getAuthHeaders, getToken, fetchApi } from '../base';
import type { User } from '../base';

export function getAvatarUrl(avatarPath: string | null | undefined): string | null {
  if (!avatarPath) return null;
  const base = getApiBase().replace(/\/$/, "");
  return `${base}/storage/${avatarPath}`;
}

export async function getProfile(): Promise<User> {
  return fetchApi<User>(`${getApiBase()}/api/profile`, {
    headers: getAuthHeaders(),
  });
}

export async function updateProfile(data: { name?: string; phone?: string | null; bio?: string | null }): Promise<User> {
  return fetchApi<User>(`${getApiBase()}/api/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export async function updateProfileWithAvatar(data: {
  name?: string;
  phone?: string | null;
  bio?: string | null;
  avatar?: File | null;
}): Promise<User> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const base = getApiBase();
  if (data.avatar) {
    const form = new FormData();
    form.set("_method", "PUT");
    if (data.name !== undefined) form.set("name", data.name);
    form.set("phone", data.phone ?? "");
    form.set("bio", data.bio ?? "");
    form.append("avatar", data.avatar);
    const res = await fetch(`${base}/api/profile`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: form,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? "Failed to update profile");
    }
    return res.json();
  }
  return updateProfile({
    name: data.name,
    phone: data.phone ?? undefined,
    bio: data.bio ?? undefined,
  });
}

export async function changePassword(data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}): Promise<void> {
  await fetchApi<{ message: string }>(`${getApiBase()}/api/profile/password`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}
