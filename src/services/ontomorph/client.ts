import { config } from '@/config';

interface OntomorphRequest {
  method: string;
  path: string;
  body?: Record<string, unknown>;
}

async function request<T>({ method, path, body }: OntomorphRequest): Promise<T> {
  const url = `${config.ontomorph.baseUrl}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.ontomorph.apiKey}`,
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Ontomorph API error: ${response.status} ${error}`);
  }

  return response.json();
}

export const ontomorphClient = {
  get: <T>(path: string) => request<T>({ method: 'GET', path }),
  post: <T>(path: string, body: Record<string, unknown>) =>
    request<T>({ method: 'POST', path, body }),
  put: <T>(path: string, body: Record<string, unknown>) =>
    request<T>({ method: 'PUT', path, body }),
  delete: <T>(path: string) => request<T>({ method: 'DELETE', path }),
};
