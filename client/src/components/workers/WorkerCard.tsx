import { Worker } from '@shared/types';
import {
  ROLE_AVATAR_BG,
  ROLE_COLORS,
  ROLE_LABELS,
} from '../../constants/roles.constants';

interface Props {
  worker: Worker;
}

export function WorkerCard({ worker }: Props) {
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
      className={`flex items-center gap-3 p-3 rounded-lg border ${colors.border} ${colors.bg}`}
    >
      <div
        className={`w-9 h-9 rounded-full ${avatarBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
      >
        {initials}
      </div>

      <div className="min-w-0">
        <p className={`text-sm font-medium truncate ${colors.text}`}>
          {worker.name}
        </p>
        <p className="text-xs text-gray-500">{ROLE_LABELS[worker.role]}</p>
      </div>

      {worker.availability !== 'AVAILABLE' && (
        <span
          className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
            worker.availability === 'SICK'
              ? 'bg-red-100 text-red-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {worker.availability}
        </span>
      )}
    </div>
  );
}
