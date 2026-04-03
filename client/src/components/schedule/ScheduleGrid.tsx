import { WeekSchedule } from '@shared/types';
import { ScheduleCell } from './ScheduleCell';

interface Props {
  schedule: WeekSchedule;
}

export function ScheduleGrid({ schedule }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {schedule.days.map((day) => (
        <ScheduleCell key={day.date} day={day} />
      ))}
    </div>
  );
}
