import { useState } from 'react';
import { X } from 'lucide-react';
import { Worker } from '@shared/types';
import { ROLE_STYLES, ROLE_LABELS } from '../../constants/roles.constants';

interface Props {
  worker: Worker;
  slotId: number;
  onRemove?: (slotId: number) => void;
}

function initialsFromName(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function WorkerRow({ worker, slotId, onRemove }: Props) {
  const [isRemoving, setIsRemoving] = useState(false);
  const initials = initialsFromName(worker.name);
  const styles = ROLE_STYLES[worker.role];

  const handleRemove = async () => {
    if (!onRemove || isRemoving) return;
    setIsRemoving(true);
    try {
      await onRemove(slotId);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div
      className={`group flex items-center gap-3 min-h-[2.75rem] px-3 py-2.5 rounded-xl border ${styles.chipBg} ${styles.chipBorder} transition-all ${
        isRemoving ? 'opacity-50' : ''
      }`}
    >
      <span
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm ${styles.avatarBg}`}
        aria-hidden
      >
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-foreground leading-snug truncate">
          {worker.name}
        </p>
        <p
          className={`text-[12px] font-medium leading-tight mt-0.5 ${styles.chipText}`}
        >
          {ROLE_LABELS[worker.role]}
        </p>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={handleRemove}
          disabled={isRemoving}
          aria-label={`Remove ${worker.name} from shift`}
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-danger hover:bg-danger-bg active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
