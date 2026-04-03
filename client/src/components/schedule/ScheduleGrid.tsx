import { WeekSchedule } from '@shared/types';
import { ScheduleCell } from './ScheduleCell';

interface Props {
  schedule: WeekSchedule;
}

export function ScheduleGrid({ schedule }: Props) {
  return (
    <div
      className="flex w-full flex-col gap-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:items-stretch lg:grid lg:gap-4 lg:[grid-template-columns:repeat(7,minmax(25rem,1fr))] xl:gap-5 2xl:gap-6 lg:overflow-x-auto lg:pb-1"
      role="list"
      aria-label="Week schedule"
    >
      {schedule.days.map((day) => (
        <div
          key={day.date}
          className="w-full min-w-0 lg:min-w-[15rem]"
          role="listitem"
        >
          <ScheduleCell day={day} />
        </div>
      ))}
    </div>
  );
}
