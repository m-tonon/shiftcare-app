import { useState, KeyboardEvent } from 'react';
import { ArrowUp } from 'lucide-react';

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const canSend = !disabled && value.trim().length > 0;

  return (
    <div className="flex items-center gap-2 p-3 border-t border-border bg-background">
      <input
        className="flex-1 h-9 px-3 text-[13px] bg-surface border border-border rounded-lg text-foreground placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors disabled:opacity-50"
        placeholder="Fill Monday morning..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        disabled={!canSend}
        aria-label="Send message"
        className={`w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center transition-all ${
          canSend
            ? 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm'
            : 'bg-surface border border-border text-subtle cursor-not-allowed'
        }`}
      >
        <ArrowUp size={15} />
      </button>
    </div>
  );
}
