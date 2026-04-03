import { useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType } from '@shared/types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Sparkles } from 'lucide-react';

interface Props {
  messages: ChatMessageType[];
  loading: boolean;
  onSend: (message: string) => void;
}

const SUGGESTIONS = [
  'Fill all shifts for today',
  'Who is available this week?',
  'Schedule a doctor for Monday morning',
];

export function ChatBox({ messages, loading, onSend }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles size={20} className="text-primary" />
            </div>

            <div className="text-center">
              <p className="text-[13px] font-medium text-foreground mb-1">
                How can I help?
              </p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Ask me to fill shifts, swap staff, or check availability.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => onSend(s)}
                  disabled={loading}
                  className="text-left text-[12px] px-3 py-2 rounded-lg border border-border bg-surface text-muted-foreground hover:bg-background hover:text-foreground hover:border-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {loading && (
              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 rounded-full bg-primary flex-shrink-0 flex items-center justify-center mt-0.5">
                  <Sparkles size={11} className="text-primary-foreground" />
                </div>

                <div className="bg-surface border border-border rounded-2xl rounded-tl-sm px-3 py-2.5">
                  <div className="flex gap-1 items-center">
                    <span
                      className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatInput onSend={onSend} disabled={loading} />
    </div>
  );
}
