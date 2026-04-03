import { ShiftName } from '@shared/types';

export const SHIFT_LABELS: Record<ShiftName, string> = {
  MORNING: 'Morning',
  AFTERNOON: 'Afternoon',
  EVENING: 'Evening',
};

export const SHIFT_TIMES: Record<ShiftName, string> = {
  MORNING: '7:00 AM – 3:00 PM',
  AFTERNOON: '3:00 PM – 11:00 PM',
  EVENING: '11:00 PM – 7:00 AM',
};
