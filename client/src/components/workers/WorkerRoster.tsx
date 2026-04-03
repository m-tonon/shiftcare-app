import { Worker, Role } from '@shared/types';
import { WorkerCard } from './WorkerCard';
import { ROLE_LABELS, ROLE_STYLES } from '../../constants/roles.constants';
import { Users } from 'lucide-react';

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
  const available = workers.filter(
    (w) => w.availability === 'AVAILABLE',
  ).length;

  return (
    <div className="flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3.5 border-b border-border">
        <div className="flex items-center gap-2 mb-0.5">
          <Users size={14} className="text-muted-foreground" />
          <h2 className="text-[13px] font-semibold text-foreground">
            Staff Roster
          </h2>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {available}/{workers.length} available
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2">
        {ROLE_ORDER.map((role) => {
          const group = workers.filter((w) => w.role === role);
          if (!group.length) return null;
          const styles = ROLE_STYLES[role];
          return (
            <div key={role} className="mb-1">
              {/* Role group label */}
              <div className="flex items-center gap-2 px-3 py-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${styles.avatarBg}`}
                />
                <span className="text-[10px] font-semibold text-subtle uppercase tracking-wider">
                  {ROLE_LABELS[role]}
                </span>
                <span className="text-[10px] text-subtle ml-auto">
                  {group.length}
                </span>
              </div>

              {/* Workers */}
              <div>
                {group.map((w) => (
                  <WorkerCard key={w.id} worker={w} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
