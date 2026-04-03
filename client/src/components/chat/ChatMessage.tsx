import { ChatMessage as ChatMessageType } from '@shared/types';
import { Sparkles } from 'lucide-react';

interface Props {
  message: ChatMessageType;
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-primary flex-shrink-0 flex items-center justify-center mt-0.5">
          <Sparkles size={11} className="text-primary-foreground" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed whitespace-pre-line ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-surface border border-border text-foreground rounded-tl-sm'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
