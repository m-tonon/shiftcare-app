import axios from 'axios';
import { ChatRequest, ChatResponse } from '@shared/types';

const BASE = (import.meta.env.VITE_API_URL ?? '/api') as string;

export const chatService = {
  send: (message: string, weekOffset = 0): Promise<ChatResponse> =>
    axios
      .post<ChatResponse>(`${BASE}/chat`, {
        message,
        weekOffset,
      } as ChatRequest)
      .then((r) => r.data),
};
