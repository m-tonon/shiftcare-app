import { DaySchedule } from '@shared/types';
import { isToday, isPastDay } from '../../utils/date.utils';

interface Props {
  days: DaySchedule[];
  selectedIndex: number;
  onSelectDay: (index: number) => void;
}

const SHORT_DAY_NAMES = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function MobileWeekSelector({ days, selectedIndex, onSelectDay }: Props) {
  return (
    <div className="flex items-center justify-between gap-1 px-2 py-3 bg-background border-b border-border/60">
      {days.map((day, index) => {
        const today = isToday(day.date);
        const past = isPastDay(day.date) && !today;
        const selected = index === selectedIndex;
        const dayNum = new Date(day.date + 'T12:00:00').getDate();

        return (
          <button
            key={day.date}
            type="button"
            onClick={() => onSelectDay(index)}
            className={`flex flex-col items-center justify-center min-w-[40px] h-[52px] rounded-xl transition-all ${
              selected
                ? today
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-foreground text-background shadow-md'
                : today
                  ? 'bg-primary/10 text-primary'
                  : past
                    ? 'text-muted-foreground/60'
                    : 'text-foreground hover:bg-surface'
            }`}
            aria-label={`${day.dayLabel}, ${day.date}`}
            aria-pressed={selected}
          >
            <span
              className={`text-[10px] font-semibold uppercase tracking-wide ${
                selected
                  ? 'opacity-90'
                  : past && !today
                    ? 'opacity-60'
                    : 'opacity-70'
              }`}
            >
              {SHORT_DAY_NAMES[index]}
            </span>
            <span
              className={`text-[15px] font-bold leading-none mt-0.5 ${
                selected ? '' : past && !today ? 'opacity-60' : ''
              }`}
            >
              {dayNum}
            </span>
            {day.shifts.some((s) => s.slots.length > 0) && (
              <span
                className={`w-1 h-1 rounded-full mt-1 ${
                  selected
                    ? 'bg-current opacity-60'
                    : today
                      ? 'bg-primary'
                      : 'bg-muted-foreground'
                }`}
                aria-hidden
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
