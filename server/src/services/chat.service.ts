import { scheduleService } from './schedule.service';
import { ChatResponse, ShiftName } from '@shared/types';

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const SHIFT_KEYWORDS: Record<string, ShiftName> = {
  morning: 'MORNING',
  afternoon: 'AFTERNOON',
  evening: 'EVENING',
};

function getDateForDay(dayName: string): string {
  const dates = scheduleService.getWeekDates();
  const idx = DAYS.indexOf(dayName as (typeof DAYS)[number]);
  return idx >= 0 ? dates[idx] : dates[0];
}

function parseShift(msg: string): ShiftName | undefined {
  return Object.entries(SHIFT_KEYWORDS).find(([key]) => msg.includes(key))?.[1];
}

function parseDay(msg: string): string | undefined {
  return DAYS.find((d) => msg.includes(d));
}

function includesAny(msg: string, words: string[]): boolean {
  return words.some((w) => msg.includes(w));
}

export const chatService = {
  handleMessage: async (message: string): Promise<ChatResponse> => {
    const msg = message.toLowerCase();

    const day = parseDay(msg);
    const shift = parseShift(msg);
    const date = day ? getDateForDay(day) : undefined;

    // Fill week
    if (msg.includes('fill') && includesAny(msg, ['week', 'all'])) {
      const filled = await scheduleService.fillWeek();

      return {
        reply: `Entire week has been filled! Added ${filled} new assignments across all shifts.`,
        action: { type: 'FILL_WEEK' },
        scheduleUpdated: true,
      };
    }

    // Fill day
    if (msg.includes('fill') && day && !shift && date) {
      const filled = await scheduleService.fillDay(date);

      return {
        reply: `Filled all 3 shifts for ${day}! Added ${filled} new assignments.`,
        action: { type: 'FILL_DAY', date },
        scheduleUpdated: true,
      };
    }

    // Fill shift
    if (msg.includes('fill') && day && shift && date) {
      const filled = await scheduleService.fillShift(date, shift);

      return {
        reply: `Filled ${day} ${shift.toLowerCase()} — added ${filled} staff members.`,
        action: { type: 'FILL_SHIFT', date, shift },
        scheduleUpdated: true,
      };
    }

    // Clear shift
    if (msg.includes('clear') && day && shift && date) {
      await scheduleService.clearShift(date, shift);

      return {
        reply: `${day} ${shift.toLowerCase()} has been cleared. All workers are now available.`,
        action: { type: 'CLEAR_SHIFT', date, shift },
        scheduleUpdated: true,
      };
    }

    // Show gaps
    if (includesAny(msg, ['gap', 'understaff', 'missing'])) {
      const week = await scheduleService.getWeekSchedule();

      const gaps = week.days.flatMap((d) =>
        d.shifts
          .filter((s) => s.isUnderstaffed)
          .map((s) => `${d.dayLabel} ${s.shift.toLowerCase()}`),
      );

      return {
        reply: gaps.length
          ? `Found ${gaps.length} understaffed shift(s): ${gaps.join(', ')}.`
          : `Great news — no gaps this week! All shifts are fully staffed.`,
        action: { type: 'SHOW_GAPS' },
        scheduleUpdated: false,
      };
    }

    // Show workers
    if (includesAny(msg, ['who', 'show']) && day && date) {
      const week = await scheduleService.getWeekSchedule();

      const daySchedule = week.days.find((d) => d.date === date);

      if (!daySchedule) {
        return {
          reply: `Couldn't find schedule for ${day}.`,
          action: { type: 'UNKNOWN' },
          scheduleUpdated: false,
        };
      }

      const lines = daySchedule.shifts.map((s) => {
        const names = s.slots
          .map((sl) => sl.worker?.name ?? '')
          .filter(Boolean)
          .join(', ');

        return `${s.shift}: ${names || 'nobody assigned'}`;
      });

      return {
        reply: `${daySchedule.dayLabel}:\n${lines.join('\n')}`,
        action: { type: 'SHOW_WORKERS', date },
        scheduleUpdated: false,
      };
    }

    return {
      reply: `I didn't catch that. Try: "fill monday morning", "fill the week", "clear friday evening", "who is working tuesday", or "any gaps this week".`,
      action: { type: 'UNKNOWN' },
      scheduleUpdated: false,
    };
  },
};
