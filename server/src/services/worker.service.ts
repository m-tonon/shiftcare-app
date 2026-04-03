import { workerRepository } from '../repositories/worker.repository';

export const workersService = {
  getAll: () => workerRepository.findAll(),
  getById: (id: number) => workerRepository.findById(id),
};
