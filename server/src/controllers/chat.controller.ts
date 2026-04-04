import { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import { ChatRequest } from '@shared/types';

export const chatController = {
  message: async (req: Request, res: Response): Promise<void> => {
    const { message, weekOffset: rawOffset } = req.body as ChatRequest;

    if (!message) {
      res.status(400).json({ error: 'message is required' });
      return;
    }

    const weekOffset =
      typeof rawOffset === 'number' && Number.isFinite(rawOffset)
        ? Math.trunc(rawOffset)
        : 0;

    const response = await chatService.processMessage(message, weekOffset);
    res.json(response);
  },
};
