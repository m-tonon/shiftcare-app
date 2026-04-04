import axios from 'axios';
import { WeekSchedule } from '@shared/types';

const BASE = 'http://localhost:3001/api';

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
