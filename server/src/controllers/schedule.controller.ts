import { Request, Response } from 'express';
import { scheduleService } from '../services/schedule.service';

export const scheduleController = {
  getWeek: async (_req: Request, res: Response): Promise<void> => {
    const schedule = await scheduleService.getWeekSchedule();
    res.json(schedule);
  },
};
