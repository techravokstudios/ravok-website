import { getApiBase, getAuthHeaders, getToken, fetchApi } from '../base';
import type { User } from '../base';

export type Category = { id: number; name: string; slug: string; description: string | null; posts_count?: number };
export type CategoryListResponse = { data: Category[]; current_page: number; last_page: number; per_page: number; total: number };
export type CategoryWithCount = Category & { posts_count: number };

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

export type PostComment = {
  id: number;
  author_name: string;
  body: string;
  created_at: string;
};

export function getPostImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = getApiBase().replace(/\/$/, "");
  return `${base}/storage/${path}`;
}

// Admin: categories
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

// Admin: posts
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

// Public insights (no auth)
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

export async function getPublicPostComments(slug: string): Promise<PostComment[]> {
  return fetchApi<PostComment[]>(
    `${getApiBase()}/api/public/posts/slug/${encodeURIComponent(slug)}/comments`,
    { headers: { Accept: "application/json" } }
  );
}

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
