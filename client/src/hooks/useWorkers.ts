import { useState, useEffect } from 'react';
import { Worker } from '@shared/types';
import { workerService } from '../services/worker.service';

export function useWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    workerService
      .getAll()
      .then(setWorkers)
      .catch(() => setError('Failed to load workers'))
      .finally(() => setLoading(false));
  }, []);

  return { workers, loading, error };
}
