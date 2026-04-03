import { Router } from 'express';
import { scheduleController } from '../controllers/schedule.controller';

const router = Router();
router.get('/', scheduleController.getWeek);
export { router as scheduleRouter };
