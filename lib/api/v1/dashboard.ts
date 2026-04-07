import { getApiBase, getAuthHeaders, fetchApi } from '../base';

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
