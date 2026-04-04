import axios from 'axios';
import { ChatRequest, ChatResponse } from '@shared/types';

const BASE = 'http://localhost:3001/api';

export const chatService = {
  send: (message: string, weekOffset = 0): Promise<ChatResponse> =>
    axios
      .post<ChatResponse>(`${BASE}/chat`, {
        message,
        weekOffset,
      } as ChatRequest)
      .then((r) => r.data),
};
