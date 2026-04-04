import { scheduleRepository } from '../repositories/schedule.repository';
import { workerRepository } from '../repositories/worker.repository';
import {
  SHIFT_NAMES,
  getShiftRulesForDate,
} from '../constants/schedule.constants';
import {
  DaySchedule,
  WeekSchedule,
  ShiftName,
  Role,
  Availability,
} from '@shared/types';

function getLocalYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getWeekDates(weekOffset = 0): string[] {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + weekOffset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return getLocalYmd(d);
  });
}

function getDayLabel(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
  });
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function mapSlot(s: {
  id: number;
  date: string;
  shift: string;
  workerId: number;
  worker: {
    id: number;
    name: string;
    role: string;
    availability: string;
  } | null;
}) {
  const w = s.worker;
  return {
    id: s.id,
    date: s.date,
    shift: s.shift as ShiftName,
    workerId: s.workerId,
    worker:
      w === null
        ? undefined
        : {
            ...w,
            role: w.role as Role,
            availability: w.availability as Availability,
          },
  };
}

function overrideKey(date: string, shift: string, role: string): string {
  return `${date}|${shift}|${role}`;
}

async function loadOverrideMap(dates: string[]): Promise<Map<string, number>> {
  const rows = await scheduleRepository.findOverridesInDates(dates);
  const m = new Map<string, number>();
  for (const r of rows) {
    m.set(overrideKey(r.date, r.shift, r.role), r.requiredCount);
  }
  return m;
}

function effectiveRequired(
  date: string,
  shift: string,
  role: string,
  base: number,
  overrideMap: Map<string, number>,
): number {
  const k = overrideKey(date, shift, role);
  return overrideMap.has(k) ? (overrideMap.get(k) as number) : base;
}

export const scheduleService = {
  getWeekDates,

  getWeekSchedule: async (weekOffset = 0): Promise<WeekSchedule> => {
    const dates = getWeekDates(weekOffset);

    const [slots, overrideMap] = await Promise.all([
      scheduleRepository.findByDateRange(dates),
      loadOverrideMap(dates),
    ]);

    const slotsByDateShift = new Map<string, typeof slots>();
    for (const s of slots) {
      const key = `${s.date}-${s.shift}`;
      if (!slotsByDateShift.has(key)) slotsByDateShift.set(key, []);
      slotsByDateShift.get(key)!.push(s);
    }

    const days: DaySchedule[] = dates.map((date) => {
      const rulesForDate = getShiftRulesForDate(date);
      const rulesByShift = new Map<string, typeof rulesForDate>();
      for (const r of rulesForDate) {
        if (!rulesByShift.has(r.shift)) rulesByShift.set(r.shift, []);
        rulesByShift.get(r.shift)!.push(r);
      }

      return {
        date,
        dayLabel: getDayLabel(date),
        shifts: SHIFT_NAMES.map((shift) => {
          const shiftSlots = slotsByDateShift.get(`${date}-${shift}`) ?? [];
          const shiftRules = rulesByShift.get(shift) ?? [];

          const requiredCount = shiftRules.reduce(
            (sum, r) =>
              sum +
              effectiveRequired(
                date,
                shift,
                r.role,
                r.requiredCount,
                overrideMap,
              ),
            0,
          );

          return {
            shift,
            slots: shiftSlots.map(mapSlot),
            requiredCount,
            isUnderstaffed: shiftSlots.length < requiredCount,
          };
        }),
      };
    });

    return { days };
  },

  fillShift: async (date: string, shift: string): Promise<number> => {
    const dates = [date];
    const overrideMap = await loadOverrideMap(dates);

    const rules = getShiftRulesForDate(date).filter((r) => r.shift === shift);
    const existing = await scheduleRepository.findByDateAndShift(date, shift);

    const existingWorkerIds = new Set(existing.map((s) => s.workerId));

    const existingByRole = new Map<string, number>();
    for (const s of existing) {
      const role = s.worker.role;
      existingByRole.set(role, (existingByRole.get(role) ?? 0) + 1);
    }

    let filled = 0;

    for (const rule of rules) {
      const need = effectiveRequired(
        date,
        shift,
        rule.role,
        rule.requiredCount,
        overrideMap,
      );

      const have = existingByRole.get(rule.role) ?? 0;
      const toAdd = need - have;

      if (toAdd <= 0) continue;

      const available = await workerRepository.findAvailableByRole(rule.role);
      const availableFiltered = shuffleArray(
        available.filter((w) => !existingWorkerIds.has(w.id)),
      );

      for (const worker of availableFiltered.slice(0, toAdd)) {
        await scheduleRepository.createSlot(date, shift, worker.id);
        existingWorkerIds.add(worker.id);
        existingByRole.set(rule.role, (existingByRole.get(rule.role) ?? 0) + 1);
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

  fillWeek: async (weekOffset = 0): Promise<number> => {
    const dates = getWeekDates(weekOffset);

    const results = await Promise.all(
      dates.map((date) => scheduleService.fillDay(date)),
    );

    return results.reduce((sum, r) => sum + r, 0);
  },

  clearShift: async (date: string, shift: string): Promise<void> => {
    await scheduleRepository.clearShift(date, shift);
  },

  setRequirementOverride: async (
    date: string,
    shift: string,
    role: string,
    requiredCount: number,
  ): Promise<void> => {
    await scheduleRepository.upsertOverride(date, shift, role, requiredCount);
  },

  clearRequirementOverridesForShift: async (
    date: string,
    shift: string,
  ): Promise<number> => {
    const result = await scheduleRepository.deleteOverridesForDateShift(
      date,
      shift,
    );
    return result.count;
  },

  removeWorkerFromSlot: async (slotId: number): Promise<void> => {
    await scheduleRepository.deleteSlot(slotId);
  },

  swapWorkerOnShift: async (
    date: string,
    shift: string,
    fromNameQuery: string,
    toNameQuery: string,
  ): Promise<{ swapped: boolean; message: string }> => {
    const fromQ = fromNameQuery.trim().toLowerCase();
    const toQ = toNameQuery.trim().toLowerCase();

    if (!fromQ || !toQ) {
      return { swapped: false, message: 'Need both names to swap.' };
    }

    const existing = await scheduleRepository.findByDateAndShift(date, shift);
    const slotFrom = existing.find((s) =>
      s.worker.name.toLowerCase().includes(fromQ),
    );

    if (!slotFrom) {
      return {
        swapped: false,
        message: `No one matching "${fromNameQuery}" on that shift.`,
      };
    }

    const allWorkers = await workerRepository.findAll();
    const toMatches = allWorkers.filter((w) =>
      w.name.toLowerCase().includes(toQ),
    );

    if (toMatches.length === 0) {
      return {
        swapped: false,
        message: `No worker found matching "${toNameQuery}".`,
      };
    }

    if (toMatches.length > 1) {
      const names = toMatches.map((w) => w.name).join(', ');
      return {
        swapped: false,
        message: `Multiple matches for "${toNameQuery}": ${names}. Be more specific.`,
      };
    }

    const toWorker = toMatches[0];

    if (toWorker.availability !== 'AVAILABLE') {
      return {
        swapped: false,
        message: `${toWorker.name} is not available (${toWorker.availability}).`,
      };
    }

    const alreadyOnShift = existing.some((s) => s.workerId === toWorker.id);
    if (alreadyOnShift) {
      return {
        swapped: false,
        message: `${toWorker.name} is already on this shift.`,
      };
    }

    await scheduleRepository.deleteSlot(slotFrom.id);
    await scheduleRepository.createSlot(date, shift, toWorker.id);

    const filled = await scheduleService.fillShift(date, shift);

    return {
      swapped: true,
      message: `Replaced ${slotFrom.worker.name} with ${toWorker.name}. Filled ${filled} open slot(s) if any.`,
    };
  },
};
