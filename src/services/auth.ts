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

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  cpf: string;
};

export function register(payload: RegisterPayload): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/register', {
    method: 'POST',
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      password_confirmation: payload.passwordConfirmation,
      cpf: payload.cpf,
    },
  });
}

export function logout(token: string): Promise<void> {
  return apiRequest<void>('/api/logout', { method: 'POST', token });
}
