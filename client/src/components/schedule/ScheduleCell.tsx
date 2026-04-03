import { DaySchedule } from '@shared/types';
import { ShiftCard } from './ShiftCard';
import { isToday, formatShortDate } from '../../utils/date.utils';

interface Props {
  day: DaySchedule;
}

export function ScheduleCell({ day }: Props) {
  const today = isToday(day.date);

  return (
    <div
      className={`flex-1 min-w-[160px] rounded-xl border-2 p-3 ${
        today ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="mb-3 text-center">
        <p
          className={`text-sm font-bold ${today ? 'text-blue-700' : 'text-gray-800'}`}
        >
          {day.dayLabel}
        </p>
        <p className="text-xs text-gray-400">{formatShortDate(day.date)}</p>
        {today && (
          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-blue-500 text-white rounded-full font-medium">
            Today
          </span>
        )}
      </div>

      <div className="space-y-2">
        {day.shifts.map((s) => (
          <ShiftCard key={s.shift} shiftSlots={s} />
        ))}
      </div>
    </div>
  );
}
