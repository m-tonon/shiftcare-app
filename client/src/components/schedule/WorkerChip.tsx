import { Worker } from '@shared/types';
import { ROLE_AVATAR_BG, ROLE_COLORS } from '../../constants/roles.constants';

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

  const colors = ROLE_COLORS[worker.role];
  const avatarBg = ROLE_AVATAR_BG[worker.role];

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs ${colors.bg} ${colors.border}`}
    >
      <div
        className={`w-5 h-5 rounded-full ${avatarBg} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}
      >
        {initials}
      </div>
      <span className={`font-medium truncate max-w-[100px] ${colors.text}`}>
        {worker.name}
      </span>
    </div>
  );
}
