import axios from 'axios';
import { Worker } from '@shared/types';

const BASE = 'http://localhost:3001/api';

export const workerService = {
  getAll: (): Promise<Worker[]> =>
    axios.get(`${BASE}/workers`).then((r) => r.data),
};
