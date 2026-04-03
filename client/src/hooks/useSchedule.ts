import { useState, useEffect, useCallback } from 'react';
import { WeekSchedule } from '@shared/types';
import { scheduleService } from '../services/schedule.service';

export function useSchedule() {
  const [schedule, setSchedule] = useState<WeekSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    scheduleService
      .getWeek()
      .then(setSchedule)
      .catch(() => setError('Failed to load schedule'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { schedule, loading, error, refresh };
}
