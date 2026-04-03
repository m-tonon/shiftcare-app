import { ShiftSlots } from '@shared/types';
import { WorkerChip } from './WorkerChip';
import { SHIFT_LABELS, SHIFT_TIMES } from '../../constants/shifts.constants';

interface Props {
  shiftSlots: ShiftSlots;
}

export function ShiftCard({ shiftSlots }: Props) {
  const { shift, slots, requiredCount, isUnderstaffed } = shiftSlots;

  return (
    <div
      className={`p-3 rounded-lg border ${
        isUnderstaffed
          ? 'border-red-300 bg-red-50 animate-pulse'
          : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs font-semibold text-gray-700">
            {SHIFT_LABELS[shift]}
          </p>
          <p className="text-[10px] text-gray-400">{SHIFT_TIMES[shift]}</p>
        </div>

        <span
          className={`text-xs px-1.5 py-0.5 rounded font-medium ${
            isUnderstaffed
              ? 'bg-red-200 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {slots.length}/{requiredCount}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {slots.map((slot) =>
          slot.worker ? (
            <WorkerChip key={slot.id} worker={slot.worker} />
          ) : null,
        )}
        {slots.length === 0 && (
          <p className="text-xs text-gray-400 italic">No staff assigned</p>
        )}
      </div>
    </div>
  );
}
