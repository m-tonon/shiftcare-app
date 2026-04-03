import axios from 'axios';
import { WeekSchedule } from '@shared/types';

const BASE = 'http://localhost:3001/api';

export const scheduleService = {
  getWeek: (): Promise<WeekSchedule> =>
    axios.get(`${BASE}/schedule`).then((r) => r.data),
};
