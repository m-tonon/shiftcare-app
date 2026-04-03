import { Worker } from '@shared/types';
import { ROLE_STYLES, ROLE_LABELS } from '../../constants/roles.constants';

interface Props {
  worker: Worker;
}

function initialsFromName(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function WorkerRow({ worker }: Props) {
  const initials = initialsFromName(worker.name);
  const styles = ROLE_STYLES[worker.role];

  return (
    <div
      className={`flex items-center gap-3 min-h-[2.75rem] px-3 py-2.5 rounded-xl border ${styles.chipBg} ${styles.chipBorder}`}
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
    </div>
  );
}
