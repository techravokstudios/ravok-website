// API base URL. Set NEXT_PUBLIC_API_URL when building for production (e.g. https://api.yoursite.com).
// If unset on a live site (not localhost), we use the same origin so /api/register hits this host.
function getApiBase(): string {
  const envRaw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (envRaw) {
    const cleaned = envRaw.replace(/\/+$/, "").replace(/\.$/, "");
    return cleaned;
  }
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    // If we're on ravokstudios.com, default API to backend.ravokstudios.com
    try {
      const url = new URL(origin);
      const host = url.hostname;
      if (host.endsWith("ravokstudios.com")) {
        // Use same-origin /api and let next.config.ts rewrites proxy to backend.
        return "";
      }
    } catch {
      // ignore parse errors and fall through
    }
    if (origin !== "http://localhost:3000" && origin !== "http://127.0.0.1:3000") {
      return origin; // live site: same origin fallback
    }
  }
  return "http://localhost:8000";
}

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

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data as { message?: string })?.message || res.statusText;
    throw new Error(Array.isArray(message) ? message[0] : message);
  }
  return data as T;
}

async function fetchApi<T>(url: string, init: RequestInit): Promise<T> {
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

type LoginResponse = { user: User; token: string; token_type: string };
type RegisterResponse = LoginResponse;

export async function login(email: string, password: string): Promise<LoginResponse> {
  // Use form-encoded to avoid preflight while CORS is being configured server-side
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
  // Use form-encoded to reduce CORS complexity on production
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

// Dashboard
export type DashboardCounts = {
  role: "admin" | "investor";
  counts: {
    users?: number;
    users_pending?: number;
    categories?: number;
    posts?: number;
    posts_published?: number;
  };
};

export async function getDashboard(): Promise<DashboardCounts> {
  return fetchApi<DashboardCounts>(`${getApiBase()}/api/dashboard`, {
    headers: getAuthHeaders(),
  });
}

// Admin: users
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

// Profile (current user)
/** Returns full URL for a profile avatar path from the API (e.g. avatars/xyz.jpg). */
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

// Document categories (admin)
export type DocumentCategory = { id: number; name: string; description: string | null; slug: string };

export async function getDocumentCategories(): Promise<DocumentCategory[]> {
  return fetchApi<DocumentCategory[]>(`${getApiBase()}/api/document-categories`, {
    headers: getAuthHeaders(),
  });
}

export async function createDocumentCategory(data: { name: string; description?: string | null }): Promise<DocumentCategory> {
  return fetchApi<DocumentCategory>(`${getApiBase()}/api/document-categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export async function updateDocumentCategory(id: number, data: { name: string; description?: string | null }): Promise<DocumentCategory> {
  return fetchApi<DocumentCategory>(`${getApiBase()}/api/document-categories/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteDocumentCategory(id: number): Promise<{ status: string }> {
  return fetchApi<{ status: string }>(`${getApiBase()}/api/document-categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

// Investor documents (admin)
export type InvestorDocument = {
  id: number;
  document_category_id: number;
  name: string;
  original_name?: string | null;
  description: string;
  file_path: string;
  mime_type: string | null;
  size_bytes: number;
  group_key?: string | null;
  created_at: string;
  updated_at: string;
  category?: DocumentCategory;
};

export type InvestorDocumentsResponse = {
  data: InvestorDocument[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export function storageUrl(path: string): string {
  const base = getApiBase().replace(/\/$/, "");
  return `${base}/storage/${path}`;
}

export async function listInvestorDocuments(page = 1, params?: { document_category_id?: number; per_page?: number }): Promise<InvestorDocumentsResponse> {
  const sp = new URLSearchParams();
  sp.set("page", String(page));
  if (params?.document_category_id != null) sp.set("document_category_id", String(params.document_category_id));
  if (params?.per_page != null) sp.set("per_page", String(params.per_page));
  const q = sp.toString();
  return fetchApi<InvestorDocumentsResponse>(`${getApiBase()}/api/documents?${q}`, {
    headers: getAuthHeaders(),
  });
}

export async function uploadInvestorDocuments(input: {
  document_category_id: number;
  name: string;
  description: string;
  files: File[];
}): Promise<{ status: string; items: InvestorDocument[] }> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const form = new FormData();
  form.set("document_category_id", String(input.document_category_id));
  form.set("name", input.name);
  form.set("description", input.description);
  input.files.forEach((f) => form.append("files[]", f));
  const res = await fetch(`${getApiBase()}/api/documents`, {
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
    throw new Error(err.message ?? "Upload failed");
  }
  return res.json();
}

export async function updateInvestorDocument(id: number, data: Partial<Pick<InvestorDocument, "document_category_id" | "name" | "description">>): Promise<InvestorDocument> {
  return fetchApi<InvestorDocument>(`${getApiBase()}/api/documents/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteInvestorDocument(id: number): Promise<{ status: string }> {
  return fetchApi<{ status: string }>(`${getApiBase()}/api/documents/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

// Settings (admin) – email forwarding
export type MailSettings = {
  mail_driver: string;
  mail_host: string;
  mail_port: string;
  mail_username: string;
  mail_password: string;
  mail_encryption: string;
  mail_from_address: string;
  mail_from_name: string;
};

export async function getMailSettings(): Promise<MailSettings> {
  return fetchApi<MailSettings>(`${getApiBase()}/api/settings/mail`, {
    headers: getAuthHeaders(),
  });
}

export async function updateMailSettings(data: Partial<MailSettings>): Promise<MailSettings> {
  return fetchApi<MailSettings>(`${getApiBase()}/api/settings/mail`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

// Categories (admin)
export type Category = { id: number; name: string; slug: string; description: string | null; posts_count?: number };

export type CategoryListResponse = { data: Category[]; current_page: number; last_page: number; per_page: number; total: number };

export async function getCategories(page = 1): Promise<CategoryListResponse> {
  return fetchApi<CategoryListResponse>(`${getApiBase()}/api/categories?page=${page}`, {
    headers: getAuthHeaders(),
  });
}

export async function getCategory(id: number): Promise<Category> {
  return fetchApi<Category>(`${getApiBase()}/api/categories/${id}`, {
    headers: getAuthHeaders(),
  });
}

export async function createCategory(data: { name: string; description?: string | null }): Promise<Category> {
  return fetchApi<Category>(`${getApiBase()}/api/categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: number, data: { name?: string; description?: string | null }): Promise<Category> {
  return fetchApi<Category>(`${getApiBase()}/api/categories/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${getApiBase()}/api/categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (res.status === 204) return;
  const data = await res.json().catch(() => ({}));
  const message = (data as { message?: string })?.message || res.statusText;
  throw new Error(Array.isArray(message) ? message[0] : message);
}

// Posts
export type Post = {
  id: number;
  title: string;
  slug: string;
  body: string;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  is_featured?: boolean;
  category?: Category;
  user?: User;
};

export type PostListResponse = { data: Post[]; current_page: number; last_page: number; per_page: number; total: number };

export async function getPosts(page = 1): Promise<PostListResponse> {
  return fetchApi<PostListResponse>(`${getApiBase()}/api/posts?page=${page}`, {
    headers: getAuthHeaders(),
  });
}

export async function getPost(id: number): Promise<Post> {
  return fetchApi<Post>(`${getApiBase()}/api/posts/${id}`, {
    headers: getAuthHeaders(),
  });
}

/** Upload image for post featured image or rich-text body. Returns storage path. */
export async function uploadPostImage(file: File): Promise<string> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const base = getApiBase();
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`${base}/api/upload/image`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "X-Requested-With": "XMLHttpRequest",
    },
    body: form,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { message?: string })?.message ?? "Upload failed");
  }
  const data = (await res.json()) as { path: string };
  return data.path;
}

export async function createPost(data: {
  category_id: number;
  title: string;
  body: string;
  featured_image?: string | null;
  is_featured?: boolean;
}): Promise<Post> {
  return fetchApi<Post>(`${getApiBase()}/api/posts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export async function updatePost(id: number, data: {
  category_id?: number;
  title?: string;
  body?: string;
  featured_image?: string | null;
  is_featured?: boolean;
}): Promise<Post> {
  return fetchApi<Post>(`${getApiBase()}/api/posts/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${getApiBase()}/api/posts/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (res.status === 204) return;
  const data = await res.json().catch(() => ({}));
  const message = (data as { message?: string })?.message || res.statusText;
  throw new Error(Array.isArray(message) ? message[0] : message);
}

// Public insights (no auth) – for /insights page
/** Returns full URL for a post featured_image path from the API. */
export function getPostImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = getApiBase().replace(/\/$/, "");
  return `${base}/storage/${path}`;
}

export type CategoryWithCount = Category & { posts_count: number };

export async function getPublicCategories(): Promise<CategoryWithCount[]> {
  return fetchApi<CategoryWithCount[]>(`${getApiBase()}/api/public/categories`, {
    headers: { Accept: "application/json" },
  });
}

export async function getPublicFeaturedPosts(limit = 5): Promise<Post[]> {
  return fetchApi<Post[]>(`${getApiBase()}/api/public/posts/featured?limit=${limit}`, {
    headers: { Accept: "application/json" },
  });
}

export async function getPublicPosts(params: {
  category_id?: number;
  page?: number;
  per_page?: number;
}): Promise<PostListResponse> {
  const sp = new URLSearchParams();
  if (params.category_id != null) sp.set("category_id", String(params.category_id));
  if (params.page != null) sp.set("page", String(params.page));
  if (params.per_page != null) sp.set("per_page", String(params.per_page));
  const qs = sp.toString();
  return fetchApi<PostListResponse>(`${getApiBase()}/api/public/posts${qs ? `?${qs}` : ""}`, {
    headers: { Accept: "application/json" },
  });
}

export async function getPublicPostBySlug(slug: string): Promise<Post> {
  return fetchApi<Post>(`${getApiBase()}/api/public/posts/slug/${encodeURIComponent(slug)}`, {
    headers: { Accept: "application/json" },
  });
}

// Public post comments (no auth)
export type PostComment = {
  id: number;
  author_name: string;
  body: string;
  created_at: string;
};

export async function getPublicPostComments(slug: string): Promise<PostComment[]> {
  return fetchApi<PostComment[]>(
    `${getApiBase()}/api/public/posts/slug/${encodeURIComponent(slug)}/comments`,
    { headers: { Accept: "application/json" } }
  );
}

/** When user is logged in, omit author_name/author_email; backend uses auth user. */
export async function createPublicPostComment(
  slug: string,
  data: { author_name?: string; author_email?: string | null; body: string }
): Promise<{ message: string; id: number }> {
  return fetchApi<{ message: string; id: number }>(
    `${getApiBase()}/api/public/posts/slug/${encodeURIComponent(slug)}/comments`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );
}

export type FormType = "writer" | "director" | "producer";
export type FormSubmission = {
  id: number;
  type: FormType;
  name: string;
  email: string;
  data: Record<string, any> | null;
  created_at: string;
};
export type FormSubmissionList = {
  data: FormSubmission[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export async function submitPublicForm(type: FormType, input: { name: string; email: string; agreed_to_terms: boolean; data: Record<string, any> }): Promise<{ status: string; id: number }> {
  return fetchApi<{ status: string; id: number }>(`${getApiBase()}/api/public/forms/${encodeURIComponent(type)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ name: input.name, email: input.email, agreed_to_terms: input.agreed_to_terms, ...input.data }),
  });
}

export async function listFormSubmissions(page = 1, type?: FormType): Promise<FormSubmissionList> {
  const sp = new URLSearchParams();
  sp.set("page", String(page));
  if (type) sp.set("type", type);
  return fetchApi<FormSubmissionList>(`${getApiBase()}/api/forms?${sp.toString()}`, {
    headers: getAuthHeaders(),
  });
}

export function exportFormSubmissionsCsvUrl(type?: FormType): string {
  const sp = new URLSearchParams();
  if (type) sp.set("type", type);
  const base = getApiBase().replace(/\/$/, "");
  return `${base}/api/forms/export/csv${sp.toString() ? `?${sp.toString()}` : ""}`;
}

export async function getFormSubmission(id: number): Promise<FormSubmission> {
  return fetchApi<FormSubmission>(`${getApiBase()}/api/forms/${id}`, {
    headers: getAuthHeaders(),
  });
}

export async function testMailSettings(): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`${getApiBase()}/api/settings/email/test`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
}

export async function deleteFormSubmission(id: number): Promise<{ status: string }> {
  return fetchApi<{ status: string }>(`${getApiBase()}/api/forms/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}
