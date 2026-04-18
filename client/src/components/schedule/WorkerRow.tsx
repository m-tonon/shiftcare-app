import { useState } from 'react';
import { X } from 'lucide-react';
import { Worker } from '@shared/types';
import { ROLE_STYLES, ROLE_LABELS } from '../../constants/roles.constants';

interface Props {
  worker: Worker;
  slotId: number;
  onRemove?: (slotId: number) => void;
  readOnly?: boolean;
}

function initialsFromName(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function WorkerRow({ worker, slotId, onRemove, readOnly }: Props) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const initials = initialsFromName(worker.name);
  const styles = ROLE_STYLES[worker.role];

  const handleRemove = async () => {
    if (!onRemove || isRemoving) return;
    setIsRemoving(true);
    try {
      await onRemove(slotId);
    } finally {
      setIsRemoving(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div
        className={`group flex items-center gap-3 min-h-[2.75rem] px-3 py-2.5 rounded-xl border ${
          styles.chipBg
        } ${styles.chipBorder} transition-all ${
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
        {onRemove && !readOnly && (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={isRemoving}
            aria-label={`Remove ${worker.name} from shift`}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-danger hover:bg-danger-bg active:scale-95 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="w-full max-w-[20rem] bg-white rounded-2xl shadow-2xl border border-black/5 p-6 animate-in zoom-in-95 duration-200">
            <h4 className="text-[17px] font-bold text-foreground tracking-tight">
              Confirm Removal
            </h4>
            <p className="mt-2 text-[14px] text-muted-foreground leading-relaxed">
              Remove <strong>{worker.name}</strong> from this shift? This cannot
              be undone.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleRemove}
                disabled={isRemoving}
                className="w-full py-2.5 px-4 rounded-xl bg-danger text-white text-[14px] font-bold hover:bg-danger/90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isRemoving ? 'Removing...' : 'Yes, remove worker'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-secondary text-secondary-foreground text-[14px] font-bold hover:bg-secondary/80 active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
