import { useState, useEffect, useCallback } from 'react';
import { WeekSchedule } from '@shared/types';
import { scheduleService } from '../services/schedule.service';

export function useSchedule(weekOffset = 0) {
  const [schedule, setSchedule] = useState<WeekSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    scheduleService
      .getWeek(weekOffset)
      .then(setSchedule)
      .catch(() => setError('Failed to load schedule'))
      .finally(() => setLoading(false));
  }, [weekOffset]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const removeSlot = useCallback(
    async (slotId: number) => {
      await scheduleService.removeSlot(slotId);
      refresh();
    },
    [refresh],
  );

  return { schedule, loading, error, refresh, removeSlot };
}
