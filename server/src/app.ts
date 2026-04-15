import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { workersRouter } from './routes/worker.routes';
import { scheduleRouter } from './routes/schedule.routes';
import { chatRouter } from './routes/chat.routes';
import { errorMiddleware } from './middlewares/error.middleware';

dotenv.config();

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/api/workers', workersRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/chat', chatRouter);

app.use(errorMiddleware);

export default app;
