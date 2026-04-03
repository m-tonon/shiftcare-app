import { Worker } from '@shared/types';
import { ROLE_STYLES, ROLE_LABELS } from '../../constants/roles.constants';

interface Props {
  worker: Worker;
}

const AVAILABILITY_BADGE: Record<string, string> = {
  AVAILABLE: '',
  SICK: 'bg-danger-bg text-danger border-danger-border',
  LEAVE: 'bg-warning-bg text-warning border-warning-border',
};

export function WorkerCard({ worker }: Props) {
  const initials = worker.name
    .split(' ')
    .filter((p) => p.match(/^[A-Z]/))
    .slice(0, 2)
    .map((p) => p[0])
    .join('');

  const styles = ROLE_STYLES[worker.role];

  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface transition-colors group">
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full ${styles.avatarBg} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-sm`}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-foreground truncate leading-tight">
          {worker.name}
        </p>
        <p className={`text-[11px] font-medium ${styles.chipText}`}>
          {ROLE_LABELS[worker.role]}
        </p>
      </div>

      {/* Availability badge */}
      {worker.availability !== 'AVAILABLE' && (
        <span
          className={`flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${AVAILABILITY_BADGE[worker.availability]}`}
        >
          {worker.availability}
        </span>
      )}
    </div>
  );
}
