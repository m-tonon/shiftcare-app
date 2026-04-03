import { scheduleRepository } from '../repositories/schedule.repository';
import { workerRepository } from '../repositories/worker.repository';
import { SHIFT_NAMES } from '../constants/schedule.constants';
import {
  DaySchedule,
  WeekSchedule,
  ShiftName,
  Role,
  Availability,
} from '@shared/types';

function getWeekDates(): string[] {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

function getDayLabel(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
  });
}

function mapSlot(s: any) {
  return {
    ...s,
    shift: s.shift as ShiftName,
    worker: s.worker && {
      ...s.worker,
      role: s.worker.role as Role,
      availability: s.worker.availability as Availability,
    },
  };
}

export const scheduleService = {
  getWeekSchedule: async (): Promise<WeekSchedule> => {
    const dates = getWeekDates();

    const [slots, rules] = await Promise.all([
      scheduleRepository.findByDateRange(dates),
      scheduleRepository.findShiftRules(),
    ]);

    // Group slots by date+shift
    const slotsByDateShift = new Map<string, typeof slots>();
    for (const s of slots) {
      const key = `${s.date}-${s.shift}`;
      if (!slotsByDateShift.has(key)) slotsByDateShift.set(key, []);
      slotsByDateShift.get(key)!.push(s);
    }

    // Group rules by shift
    const rulesByShift = new Map<string, typeof rules>();
    for (const r of rules) {
      if (!rulesByShift.has(r.shift)) rulesByShift.set(r.shift, []);
      rulesByShift.get(r.shift)!.push(r);
    }

    const days: DaySchedule[] = dates.map((date) => ({
      date,
      dayLabel: getDayLabel(date),
      shifts: SHIFT_NAMES.map((shift) => {
        const shiftSlots = slotsByDateShift.get(`${date}-${shift}`) ?? [];
        const shiftRules = rulesByShift.get(shift) ?? [];

        const requiredCount = shiftRules.reduce(
          (sum, r) => sum + r.requiredCount,
          0,
        );

        return {
          shift,
          slots: shiftSlots.map(mapSlot),
          requiredCount,
          isUnderstaffed: shiftSlots.length < requiredCount,
        };
      }),
    }));

    return { days };
  },

  fillShift: async (date: string, shift: string): Promise<number> => {
    const [rules, existing] = await Promise.all([
      scheduleRepository.findShiftRules(),
      scheduleRepository.findByDateAndShift(date, shift),
    ]);

    const existingWorkerIds = new Set(existing.map((s) => s.workerId));

    // Group existing by role
    const existingByRole = new Map<string, number>();
    for (const s of existing) {
      const role = s.worker.role;
      existingByRole.set(role, (existingByRole.get(role) ?? 0) + 1);
    }

    let filled = 0;

    for (const rule of rules.filter((r) => r.shift === shift)) {
      const available = await workerRepository.findAvailableByRole(rule.role);

      const needed = rule.requiredCount - (existingByRole.get(rule.role) ?? 0);

      if (needed <= 0) continue;

      const availableFiltered = available.filter(
        (w) => !existingWorkerIds.has(w.id),
      );

      for (const worker of availableFiltered.slice(0, needed)) {
        await scheduleRepository.createSlot(date, shift, worker.id);
        filled++;
      }
    }

    return filled;
  },

  fillDay: async (date: string): Promise<number> => {
    const results = await Promise.all(
      SHIFT_NAMES.map((shift) => scheduleService.fillShift(date, shift)),
    );

    return results.reduce((sum, r) => sum + r, 0);
  },

  fillWeek: async (): Promise<number> => {
    const dates = getWeekDates();

    const results = await Promise.all(
      dates.map((date) => scheduleService.fillDay(date)),
    );

    return results.reduce((sum, r) => sum + r, 0);
  },

  clearShift: async (date: string, shift: string): Promise<void> => {
    await scheduleRepository.clearShift(date, shift);
  },

  getWeekDates,
};
