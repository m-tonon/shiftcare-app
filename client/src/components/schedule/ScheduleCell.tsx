import { DaySchedule } from '@shared/types';
import { ShiftCard } from './ShiftCard';
import { isToday, isPastDay, formatShortDate } from '../../utils/date.utils';

export function scheduleDayElementId(date: string): string {
  return `schedule-day-${date}`;
}

interface Props {
  day: DaySchedule;
}

export function ScheduleCell({ day }: Props) {
  const today = isToday(day.date);
  const past = isPastDay(day.date);
  const mutedPast = past && !today;

  return (
    <article
      id={scheduleDayElementId(day.date)}
      className={`flex h-full w-full flex-col rounded-2xl border shadow-sm transition-[opacity,filter,box-shadow] ${
        mutedPast
          ? 'border-border/50 bg-surface-raised/90 opacity-[0.78] saturate-[0.65] contrast-[0.92]'
          : today
            ? 'border-primary/35 bg-background ring-2 ring-primary/15 shadow-md'
            : 'border-border/90 bg-surface-raised'
      }`}
    >
      <header
        className={`flex items-center justify-between gap-3 px-4 py-4 sm:px-5 sm:py-4 ${
          today
            ? 'bg-primary/[0.06]'
            : mutedPast
              ? 'bg-black/[0.03]'
              : 'bg-background/50'
        }`}
      >
        <div className="min-w-0">
          <p
            className={`text-xl font-bold tracking-tight leading-none sm:text-[1.35rem] ${
              today
                ? 'text-primary'
                : mutedPast
                  ? 'text-muted-foreground'
                  : 'text-foreground'
            }`}
          >
            {day.dayLabel}
          </p>
          <p
            className={`text-[14px] mt-2 font-medium ${
              mutedPast ? 'text-subtle' : 'text-muted-foreground'
            }`}
          >
            {formatShortDate(day.date)}
          </p>
        </div>
        {today && (
          <span className="flex-shrink-0 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-primary text-primary-foreground">
            Today
          </span>
        )}
        {mutedPast && (
          <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/[0.06] text-muted-foreground">
            Past
          </span>
        )}
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5 sm:gap-5 border-t border-border/60">
        {day.shifts.map((s) => (
          <ShiftCard key={s.shift} shiftSlots={s} />
        ))}
      </div>
    </article>
  );
}
