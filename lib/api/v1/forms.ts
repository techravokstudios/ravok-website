import { getApiBase, getAuthHeaders, fetchApi } from '../base';

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

export async function submitPublicForm(type: FormType, input: { name: string; email: string; data: Record<string, any> }): Promise<{ status: string; id: number }> {
  return fetchApi<{ status: string; id: number }>(`${getApiBase()}/api/public/forms/${encodeURIComponent(type)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ name: input.name, email: input.email, ...input.data }),
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

export async function deleteFormSubmission(id: number): Promise<{ status: string }> {
  return fetchApi<{ status: string }>(`${getApiBase()}/api/forms/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}
