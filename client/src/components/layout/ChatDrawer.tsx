import { X, Sparkles } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@shared/types';
import { ChatBox } from '../chat/ChatBox';

interface Props {
  open: boolean;
  onClose: () => void;
  messages: ChatMessageType[];
  loading: boolean;
  onSend: (message: string) => void;
}

export function ChatDrawer({
  open,
  onClose,
  messages,
  loading,
  onSend,
}: Props) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-foreground/20 transition-opacity duration-300 ${
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile: slide up from bottom */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl bg-background border-t border-border shadow-xl transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '80svh' }}
      >
        <DrawerHeader onClose={onClose} />
        <ChatBox messages={messages} loading={loading} onSend={onSend} />
      </div>

      {/* Desktop: slide in from right */}
      <div
        className={`hidden md:flex fixed top-0 right-0 bottom-0 z-50 flex-col w-96 bg-background border-l border-border shadow-xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <DrawerHeader onClose={onClose} />
        <ChatBox messages={messages} loading={loading} onSend={onSend} />
      </div>
    </>
  );
}

function DrawerHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex-shrink-0 flex items-center gap-2.5 px-4 py-3.5 border-b border-border">
      {/* Drag handle — mobile only */}
      <div className="md:hidden absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-border rounded-full" />

      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
        <Sparkles size={14} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-foreground leading-tight">
          AI Assistant
        </p>
        <p className="text-[11px] text-muted-foreground">
          Ask me to fill shifts, swap staff&hellip;
        </p>
      </div>
      <button
        onClick={onClose}
        aria-label="Close chat"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-subtle hover:bg-surface hover:text-foreground transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
