import { useRef, useEffect, useCallback } from 'react';
import { WeekSchedule } from '@shared/types';
import { ScheduleCell, scheduleDayElementId } from './ScheduleCell';
import { MobileWeekSelector } from './MobileWeekSelector';
import { useScheduleView } from '../../contexts/ScheduleViewContext';
import { getLocalDateString, isToday } from '../../utils/date.utils';

interface Props {
  schedule: WeekSchedule;
  onInitialScrollComplete?: () => void;
  onRemoveSlot?: (slotId: number) => void;
}

export function ScheduleGrid({ schedule, onInitialScrollComplete, onRemoveSlot }: Props) {
  const { selectedDayIndex, setSelectedDayIndex } = useScheduleView();
  const gridRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  const scrollToDay = useCallback(
    (dayDate: string, behavior: ScrollBehavior = 'smooth') => {
      const grid = gridRef.current;
      if (!grid) return;

      const dayEl = grid.querySelector(
        `[data-day-date="${dayDate}"]`,
      ) as HTMLElement | null;
      if (!dayEl) return;

      const gridRect = grid.getBoundingClientRect();
      const dayRect = dayEl.getBoundingClientRect();
      const scrollLeft = dayRect.left - gridRect.left + grid.scrollLeft;

      grid.scrollTo({ left: scrollLeft, behavior });
    },
    [],
  );

  const scrollToMonday = useCallback(
    (behavior: ScrollBehavior = 'auto') => {
      const grid = gridRef.current;
      if (!grid) return;
      grid.scrollTo({ left: 0, behavior });
    },
    [],
  );

  useEffect(() => {
    if (hasScrolledRef.current || !schedule.days.length) return;
    hasScrolledRef.current = true;

    const todayDate = getLocalDateString();
    const todayIndex = schedule.days.findIndex((d) => isToday(d.date));

    if (todayIndex !== -1) {
      setSelectedDayIndex(todayIndex);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToDay(todayDate, 'auto');
          onInitialScrollComplete?.();
        });
      });
    } else {
      scrollToMonday('auto');
      onInitialScrollComplete?.();
    }
  }, [schedule.days, scrollToDay, scrollToMonday, setSelectedDayIndex, onInitialScrollComplete]);

  const selectedDay = schedule.days[selectedDayIndex] ?? schedule.days[0];

  return (
    <div className="flex flex-col w-full">
      <div className="sm:hidden -mx-4 -mt-4">
        <MobileWeekSelector
          days={schedule.days}
          selectedIndex={selectedDayIndex}
          onSelectDay={setSelectedDayIndex}
        />
        <div className="px-4 pt-4 pb-0">
          {selectedDay && <ScheduleCell day={selectedDay} onRemoveSlot={onRemoveSlot} />}
        </div>
      </div>

      <div
        ref={gridRef}
        className="hidden sm:grid sm:grid-cols-2 sm:gap-4 sm:items-stretch lg:overflow-x-auto lg:grid lg:gap-4 lg:[grid-template-columns:repeat(7,minmax(22rem,1fr))] xl:gap-2 2xl:gap-6 lg:pb-1 schedule-scroll-container"
        role="list"
        aria-label="Week schedule"
      >
        {schedule.days.map((day) => (
          <div
            key={day.date}
            id={scheduleDayElementId(day.date)}
            data-day-date={day.date}
            className="w-full min-w-0 lg:min-w-[15rem]"
            role="listitem"
          >
            <ScheduleCell day={day} onRemoveSlot={onRemoveSlot} />
          </div>
        ))}
      </div>
    </div>
  );
}
