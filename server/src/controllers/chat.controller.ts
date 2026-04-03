import { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import { ChatRequest } from '@shared/types';

export const chatController = {
  message: async (req: Request, res: Response): Promise<void> => {
    const { message } = req.body as ChatRequest;

    if (!message) {
      res.status(400).json({ error: 'message is required' });
      return;
    }

    const response = await chatService.handleMessage(message);
    res.json(response);
  },
};
