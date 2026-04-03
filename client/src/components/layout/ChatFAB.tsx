import { Sparkles } from 'lucide-react';

interface Props {
  onClick: () => void;
  hasUnread: boolean;
}

export function ChatFAB({ onClick, hasUnread }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="Open AI assistant"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary-hover transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
    >
      <Sparkles size={22} />
      {hasUnread && (
        <span className="absolute top-1 right-1 w-3 h-3 bg-danger rounded-full border-2 border-background" />
      )}
    </button>
  );
}
