import { Worker } from '@shared/types';
import { ROLE_STYLES } from '../../constants/roles.constants';

interface Props {
  worker: Worker;
}

export function WorkerChip({ worker }: Props) {
  const initials = worker.name
    .split(' ')
    .filter((p) => p.match(/^[A-Z]/))
    .slice(0, 2)
    .map((p) => p[0])
    .join('');

  const styles = ROLE_STYLES[worker.role];

  return (
    <div
      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[11px] font-medium ${styles.chipBg} ${styles.chipBorder} ${styles.chipText}`}
    >
      <span
        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0 ${styles.avatarBg}`}
      >
        {initials}
      </span>
      <span className="truncate max-w-[80px]">{worker.name.split(' ')[0]}</span>
    </div>
  );
}
