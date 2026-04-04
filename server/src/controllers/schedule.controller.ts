import { Request, Response } from 'express';
import { scheduleService } from '../services/schedule.service';

export const scheduleController = {
  getWeek: async (req: Request, res: Response): Promise<void> => {
    const raw = req.query.offset;
    const parsed =
      typeof raw === 'string' ? Number.parseInt(raw, 10) : Number.NaN;
    const weekOffset = Number.isFinite(parsed) ? parsed : 0;

    const schedule = await scheduleService.getWeekSchedule(weekOffset);
    res.json(schedule);
  },

  removeSlot: async (req: Request, res: Response): Promise<void> => {
    const slotId = Number.parseInt(req.params.slotId, 10);
    if (!Number.isFinite(slotId)) {
      res.status(400).json({ error: 'Invalid slot ID' });
      return;
    }

    await scheduleService.removeWorkerFromSlot(slotId);
    res.status(204).send();
  },
};
