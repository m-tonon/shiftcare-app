import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const scheduleRepository = {
  findByDateRange: (dates: string[]) =>
    prisma.scheduleSlot.findMany({
      where: { date: { in: dates } },
      include: { worker: true },
    }),

  findByDateAndShift: (date: string, shift: string) =>
    prisma.scheduleSlot.findMany({
      where: { date, shift },
      include: { worker: true },
    }),

  findShiftRules: () => prisma.shiftRule.findMany(),

  createSlot: (date: string, shift: string, workerId: number) =>
    prisma.scheduleSlot.upsert({
      where: { date_shift_workerId: { date, shift, workerId } },
      update: {},
      create: { date, shift, workerId },
    }),

  clearShift: (date: string, shift: string) =>
    prisma.scheduleSlot.deleteMany({ where: { date, shift } }),

  deleteSlot: (id: number) => prisma.scheduleSlot.delete({ where: { id } }),
};
