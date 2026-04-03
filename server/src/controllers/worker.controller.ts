import { Request, Response } from 'express';
import { workersService } from '../services/worker.service';

export const workersController = {
  getAll: async (_req: Request, res: Response): Promise<void> => {
    const workers = await workersService.getAll();
    res.json(workers);
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const worker = await workersService.getById(Number(req.params.id));

    if (!worker) {
      res.status(404).json({ error: 'Worker not found' });
      return;
    }

    res.json(worker);
  },
};
