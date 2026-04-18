import axios from 'axios';
import { WeekSchedule } from '@shared/types';

const BASE = (import.meta.env.VITE_API_URL ?? '/api') as string;

export const scheduleService = {
  getWeek: (weekOffset = 0): Promise<WeekSchedule> =>
    axios
      .get(`${BASE}/schedule`, {
        params: weekOffset !== 0 ? { offset: weekOffset } : undefined,
      })
      .then((r) => r.data),

  removeSlot: (slotId: number): Promise<void> =>
    axios.delete(`${BASE}/schedule/slots/${slotId}`).then(() => undefined),
};
