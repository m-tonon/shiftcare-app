import axios from 'axios';
import { Worker } from '@shared/types';

const BASE = (import.meta.env.VITE_API_URL ?? '/api') as string;

export const workerService = {
  getAll: (): Promise<Worker[]> =>
    axios.get(`${BASE}/workers`).then((r) => r.data),
};
