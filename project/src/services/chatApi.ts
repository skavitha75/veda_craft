export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ChatReply {
  reply: string;
  source: 'openai' | 'fallback';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const sendChatMessage = async (
  message: string,
  messages: ChatMessage[]
): Promise<ChatReply> => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      messages,
    }),
  });

  const payload = (await response.json()) as ApiResponse<ChatReply>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Unable to send message');
  }

  return payload.data;
};
