import { getApiBase, getAuthHeaders, fetchApi } from '../base';

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

export async function testMailSettings(): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`${getApiBase()}/api/settings/email/test`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
}
