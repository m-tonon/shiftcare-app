import prisma from '../lib/prisma';


export const workerRepository = {
  findAll: () => prisma.worker.findMany({ orderBy: { id: 'asc' } }),

  findById: (id: number) => prisma.worker.findUnique({ where: { id } }),

  findAvailableByRole: (role: string) =>
    prisma.worker.findMany({ where: { role, availability: 'AVAILABLE' } }),
};
