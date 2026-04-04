import { useState } from 'react';
import { ChatMessage } from '@shared/types';
import { chatService } from '../services/chat.service';

export function useChat(onScheduleUpdate: () => void, weekOffset: number = 0) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content:
        'Hi! I\'m ShiftCare AI. I use the week shown on your schedule. Try: "fill the week", "need 3 doctors on saturday morning", "swap Maria with James on monday morning", "any gaps", or "who is working tuesday".',
      timestamp: new Date().toISOString(),
    },
  ]);

  const send = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await chatService.send(text, weekOffset);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        action: response.action,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (response.scheduleUpdated) onScheduleUpdate();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, send };
}
