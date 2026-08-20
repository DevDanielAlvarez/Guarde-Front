import { apiRequest } from '@/services/api';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type LoginResponse = {
  user: AuthUser;
  token: string;
};

export function login(login: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/login', {
    method: 'POST',
    body: { login, password },
  });
}

export function logout(token: string): Promise<void> {
  return apiRequest<void>('/api/logout', { method: 'POST', token });
}
