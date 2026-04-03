import { Worker, Role } from '@shared/types';
import { WorkerCard } from './WorkerCard';
import { ROLE_LABELS } from '../../constants/roles.constants';

interface Props {
  workers: Worker[];
}

const ROLE_ORDER: Role[] = [
  'DOCTOR',
  'NURSE',
  'RECEPTIONIST',
  'TECHNICIAN',
  'PHARMACIST',
  'CLEANING',
];

export function WorkerRoster({ workers }: Props) {
  return (
    <aside className="w-72 flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800">Staff Roster</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {workers.length} total staff
        </p>
      </div>

      <div className="p-3 space-y-4">
        {ROLE_ORDER.map((role) => {
          const group = workers.filter((w) => w.role === role);
          if (!group.length) return null;
          return (
            <div key={role}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {ROLE_LABELS[role]} ({group.length})
              </p>

              <div className="space-y-1.5">
                {group.map((w) => (
                  <WorkerCard key={w.id} worker={w} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
