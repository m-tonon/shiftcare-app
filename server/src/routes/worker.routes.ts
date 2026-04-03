import { Router } from 'express';
import { workersController } from '../controllers/worker.controller';

const router = Router();
router.get('/', workersController.getAll);
router.get('/:id', workersController.getById);
export { router as workersRouter };
