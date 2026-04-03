import axios from 'axios';
import { ChatRequest, ChatResponse } from '@shared/types';

const BASE = 'http://localhost:3001/api';

export const chatService = {
  send: (message: string): Promise<ChatResponse> =>
    axios
      .post<ChatResponse>(`${BASE}/chat`, { message } as ChatRequest)
      .then((r) => r.data),
};
