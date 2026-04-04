import { Router } from 'express';
import { scheduleController } from '../controllers/schedule.controller';

const router = Router();
router.get('/', scheduleController.getWeek);
router.delete('/slots/:slotId', scheduleController.removeSlot);
export { router as scheduleRouter };
