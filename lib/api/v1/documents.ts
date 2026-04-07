import { getApiBase, getAuthHeaders, getToken, fetchApi } from '../base';

export type DocumentCategory = { id: number; name: string; description: string | null; slug: string };

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
