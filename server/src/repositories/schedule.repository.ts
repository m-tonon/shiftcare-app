import prisma from '../lib/prisma';


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

  createSlot: (date: string, shift: string, workerId: number) =>
    prisma.scheduleSlot.upsert({
      where: { date_shift_workerId: { date, shift, workerId } },
      update: {},
      create: { date, shift, workerId },
    }),

  clearShift: (date: string, shift: string) =>
    prisma.scheduleSlot.deleteMany({ where: { date, shift } }),

  clearDates: (dates: string[]) =>
    prisma.scheduleSlot.deleteMany({ where: { date: { in: dates } } }),

  deleteSlot: (id: number) => prisma.scheduleSlot.delete({ where: { id } }),

  findOverridesInDates: (dates: string[]) =>
    prisma.shiftRequirementOverride.findMany({
      where: { date: { in: dates } },
    }),

  upsertOverride: (
    date: string,
    shift: string,
    role: string,
    requiredCount: number,
  ) =>
    prisma.shiftRequirementOverride.upsert({
      where: {
        date_shift_role: { date, shift, role },
      },
      update: { requiredCount },
      create: { date, shift, role, requiredCount },
    }),

  deleteOverridesForDateShift: (date: string, shift: string) =>
    prisma.shiftRequirementOverride.deleteMany({
      where: { date, shift },
    }),
};
