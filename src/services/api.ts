const API_URL = process.env.EXPO_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>;

  constructor(message: string, status: number, errors: Record<string, string[]> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }

  firstError(): string {
    return Object.values(this.errors)[0]?.[0] ?? this.message;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
};

export async function apiRequest<TResponse>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {}
): Promise<TResponse> {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_API_URL não está configurada.');
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message ?? 'Não foi possível completar a requisição.',
      response.status,
      data?.errors ?? {}
    );
  }

  return data as TResponse;
}

type UploadOptions = {
  formData: FormData;
  token?: string | null;
};

/**
 * Same error handling as apiRequest, but for multipart uploads — no JSON.stringify
 * and no manual Content-Type, so fetch can set the multipart boundary itself.
 */
export async function apiUpload<TResponse>(
  path: string,
  { formData, token }: UploadOptions
): Promise<TResponse> {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_API_URL não está configurada.');
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message ?? 'Não foi possível completar a requisição.',
      response.status,
      data?.errors ?? {}
    );
  }

  return data as TResponse;
}
