import { apiRequest } from '@/services/api';

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

type SendChatMessageResponse = {
  data: ChatMessage;
};

export function sendChatMessage(
  token: string,
  message: string,
  history: ChatMessage[]
): Promise<SendChatMessageResponse> {
  return apiRequest<SendChatMessageResponse>('/api/chat', {
    method: 'POST',
    token,
    body: { message, history },
  });
}
