import { useMemo } from 'react';
import { ShiftSlots, Role, ScheduleSlot, ShiftName } from '@shared/types';
import { WorkerRow } from './WorkerRow';
import { SHIFT_LABELS, SHIFT_TIMES } from '../../constants/shifts.constants';
import {
  ROLE_DISPLAY_ORDER,
  ROLE_LABELS,
} from '../../constants/roles.constants';
import { Sun, CloudSun, Moon, type LucideIcon } from 'lucide-react';

interface Props {
  shiftSlots: ShiftSlots;
  onRemoveSlot?: (slotId: number) => void;
}

export const SHIFT_ICONS: Record<string, LucideIcon> = {
  MORNING: Sun,
  AFTERNOON: CloudSun,
  EVENING: Moon,
};

const SHIFT_SURFACE: Record<ShiftName, string> = {
  MORNING: 'bg-[var(--shift-morning-bg)] border-[var(--shift-morning-border)]',
  AFTERNOON:
    'bg-[var(--shift-afternoon-bg)] border-[var(--shift-afternoon-border)]',
  EVENING: 'bg-[var(--shift-evening-bg)] border-[var(--shift-evening-border)]',
};


export function ShiftCard({ shiftSlots, onRemoveSlot }: Props) {
  const { shift, slots, requiredCount, isUnderstaffed, roleRequirements } =
    shiftSlots;
  const Icon = SHIFT_ICONS[shift];
  const filled = slots.filter((s) => s.worker).length;

  const roleSections = useMemo(() => {
    const byRole = new Map<Role, ScheduleSlot[]>();

    for (const slot of slots) {
      if (!slot.worker) continue;

      const r = slot.worker.role;
      const list = byRole.get(r) ?? [];

      list.push(slot);
      byRole.set(r, list);
    }

    const requirements = roleRequirements ?? [];
    const allRoles = new Set<Role>([
      ...requirements.map((r) => r.role),
      ...Array.from(byRole.keys()),
    ]);

    const orderedRoles = ROLE_DISPLAY_ORDER.filter((r) => allRoles.has(r));
    for (const r of allRoles) {
      if (!ROLE_DISPLAY_ORDER.includes(r)) orderedRoles.push(r);
    }

    return orderedRoles.map((role) => {
      const req = requirements.find((r) => r.role === role);
      const roleSlots = byRole.get(role) ?? [];
      return {
        role,
        slots: roleSlots,
        required: req?.required ?? 0,
        actual: req?.actual ?? roleSlots.length,
      };
    });
  }, [slots, roleRequirements]);

  const surfaceClass = isUnderstaffed
    ? `${SHIFT_SURFACE[shift]} ring-2 ring-danger-border`
    : SHIFT_SURFACE[shift];

  return (
    <section
      className={`rounded-2xl border p-4 sm:p-5 ${surfaceClass}`}
      aria-label={`${SHIFT_LABELS[shift]} shift`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-white/70 shadow-sm ${
              isUnderstaffed ? 'text-danger' : 'text-primary'
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-foreground leading-tight tracking-tight">
              {SHIFT_LABELS[shift]}
            </h3>
            <p className="text-[13px] text-muted-foreground mt-1 leading-snug">
              {SHIFT_TIMES[shift]}
            </p>
          </div>
        </div>

        <div
          className={`flex-shrink-0 text-[13px] font-bold tabular-nums px-3 py-1.5 rounded-full ${
            isUnderstaffed
              ? 'bg-danger-border/50 text-danger'
              : 'bg-white/80 text-success border border-success-border'
          }`}
        >
          {filled}/{requiredCount}
        </div>
      </div>

      <div className="mt-5 space-y-5">
        {roleSections.map(({ role, slots: roleSlots, required, actual }) => (
          <div key={role}>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-2.5">
              {ROLE_LABELS[role]}
            </p>
            <ul className="space-y-2 list-none p-0 m-0">
              {roleSlots.map((slot) =>
                slot.worker ? (
                  <li key={slot.id}>
                    <WorkerRow
                      worker={slot.worker}
                      slotId={slot.id}
                      onRemove={onRemoveSlot}
                    />
                  </li>
                ) : null,
              )}

              {actual < required && (
                <li className="rounded-xl border border-dashed border-danger-border/30 bg-danger-border/5 px-3 py-2.5 text-[12px] font-semibold text-danger flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                  Missing {required - actual} {ROLE_LABELS[role]}
                  {required - actual > 1 ? 's' : ''}
                </li>
              )}
            </ul>
          </div>
        ))}

        {roleSections.length === 0 && (
          <p className="text-[14px] text-muted-foreground leading-relaxed italic">
            No staffing requirements defined.
          </p>
        )}
      </div>
    </section>
  );
}
