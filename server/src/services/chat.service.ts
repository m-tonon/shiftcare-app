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

const ROLE_ALIASES: Record<string, string> = {
  doctor: 'DOCTOR',
  doctors: 'DOCTOR',
  nurse: 'NURSE',
  nurses: 'NURSE',
  receptionist: 'RECEPTIONIST',
  receptionists: 'RECEPTIONIST',
  technician: 'TECHNICIAN',
  technicians: 'TECHNICIAN',
  pharmacist: 'PHARMACIST',
  pharmacists: 'PHARMACIST',
  cleaning: 'CLEANING',
};

// Helpers

function resolveWeekDates(weekOffset: number): string[] {
  return scheduleService.getWeekDates(weekOffset);
}

function resolveDateForDay(
  dayName: string,
  weekOffset: number,
): string | undefined {
  const dates = resolveWeekDates(weekOffset);
  const idx = DAYS.indexOf(dayName as (typeof DAYS)[number]);
  return idx >= 0 ? dates[idx] : undefined;
}

function resolveDatesForToken(token: string, weekOffset: number): string[] {
  if (token === 'weekend') {
    return ['saturday', 'sunday']
      .map((d) => resolveDateForDay(d, weekOffset))
      .filter(Boolean) as string[];
  }
  const d = resolveDateForDay(token, weekOffset);
  return d ? [d] : [];
}

function resolveShifts(shiftWord?: string): ShiftName[] {
  return shiftWord
    ? [SHIFT_KEYWORDS[shiftWord] as ShiftName]
    : ['MORNING', 'AFTERNOON', 'EVENING'];
}

function parseShift(msg: string): ShiftName | undefined {
  return Object.entries(SHIFT_KEYWORDS).find(([key]) => msg.includes(key))?.[1];
}

function parseDay(msg: string): string | undefined {
  return DAYS.find((d) => msg.includes(d));
}

function msgIncludes(msg: string, words: string[]): boolean {
  return words.some((w) => msg.includes(w));
}

function normalizeRole(raw: string): string | undefined {
  const t = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  return ROLE_ALIASES[t];
}

const UNKNOWN_ACTION: ChatResponse = {
  reply: '',
  action: { type: 'UNKNOWN' },
  scheduleUpdated: false,
};

function unknownReply(reply: string): ChatResponse {
  return { ...UNKNOWN_ACTION, reply };
}

// Intent parsers

async function parseSetRequirement(
  msg: string,
  weekOffset: number,
): Promise<ChatResponse | null> {
  const m = msg.match(
    /(?:need|require|want|set)\s+(\d+)\s+([a-z]+)\s+(?:on\s+)?(?:the\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekend)(?:\s+(morning|afternoon|evening))?/i,
  );

  if (!m) return null;

  const count = Number.parseInt(m[1], 10);
  if (!Number.isFinite(count) || count < 0 || count > 50) {
    return unknownReply('Use a sensible count between 0 and 50.');
  }

  const role = normalizeRole(m[2]);
  if (!role) {
    return unknownReply(
      'Say a role: doctor, nurse, receptionist, technician, pharmacist, or cleaning.',
    );
  }

  const dayToken = m[3].toLowerCase();
  const shiftWord = m[4]?.toLowerCase();
  const shifts = resolveShifts(shiftWord);
  const dates = resolveDatesForToken(dayToken, weekOffset);

  if (dates.length === 0) {
    return unknownReply(
      "Couldn't resolve that day for the week you're viewing.",
    );
  }

  for (const date of dates) {
    for (const shift of shifts) {
      await scheduleService.setRequirementOverride(date, shift, role, count);
    }
  }

  return {
    reply: `Updated staffing rules: ${count} ${role}(s) per ${shiftWord || 'each shift (morning, afternoon, evening)'}. Say "fill the week" or "fill saturday morning" to assign people.`,
    action: { type: 'SET_REQUIREMENT', date: dates[0], shift: shifts[0] },
    scheduleUpdated: true,
  };
}

async function parseClearOverrides(
  msg: string,
  weekOffset: number,
): Promise<ChatResponse | null> {
  const m = msg.match(
    /(?:clear|remove|reset)\s+(?:override|requirement|rule)s?\s*(?:for\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s+(morning|afternoon|evening))?/i,
  );

  if (!m) return null;

  const day = m[1].toLowerCase();
  const shiftWord = m[2]?.toLowerCase();
  const date = resolveDateForDay(day, weekOffset);

  if (!date) {
    return unknownReply("Couldn't resolve that day.");
  }

  const shifts = resolveShifts(shiftWord);
  let total = 0;

  for (const shift of shifts) {
    total += await scheduleService.clearRequirementOverridesForShift(
      date,
      shift,
    );
  }

  return {
    reply:
      total > 0
        ? `Cleared ${total} custom requirement(s) for ${day}; default rules apply again.`
        : `No custom overrides were stored for ${day}.`,
    action: { type: 'CLEAR_SHIFT_OVERRIDES', date },
    scheduleUpdated: true,
  };
}

async function parseSwapWorker(
  msg: string,
  weekOffset: number,
): Promise<ChatResponse | null> {
  const m = msg.match(
    /(?:swap|replace)\s+(.+?)\s+(?:with|for)\s+(.+?)\s+(?:on\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+(morning|afternoon|evening)/i,
  );

  if (!m) return null;

  const fromName = m[1].trim();
  const toName = m[2].trim();
  const day = m[3].toLowerCase();
  const shift = SHIFT_KEYWORDS[m[4].toLowerCase()] as ShiftName;
  const date = resolveDateForDay(day, weekOffset);

  if (!date) {
    return unknownReply("Couldn't resolve that day.");
  }

  const result = await scheduleService.swapWorkerOnShift(
    date,
    shift,
    fromName,
    toName,
  );

  return {
    reply: result.message,
    action: { type: 'SWAP_WORKER', date, shift, workerName: toName },
    scheduleUpdated: result.swapped,
  };
}

// Main dispatcher

export const chatService = {
  processMessage: async (
    message: string,
    weekOffset = 0,
  ): Promise<ChatResponse> => {
    const msg = message.toLowerCase();

    const day = parseDay(msg);
    const shift = parseShift(msg);
    const date = day ? resolveDateForDay(day, weekOffset) : undefined;

    const clearOverridesResult = await parseClearOverrides(msg, weekOffset);
    if (clearOverridesResult) return clearOverridesResult;

    const setRequirementResult = await parseSetRequirement(msg, weekOffset);
    if (setRequirementResult) return setRequirementResult;

    const swapWorkerResult = await parseSwapWorker(msg, weekOffset);
    if (swapWorkerResult) return swapWorkerResult;

    if (
      msg.includes('fill') &&
      (msgIncludes(msg, ['week', 'all', 'schedule']) ||
        /\bfill\s+(it|this|everything)\s+up\b/.test(msg)) &&
      !day
    ) {
      const filled = await scheduleService.fillWeek(weekOffset);
      return {
        reply: `Filled the week (offset ${weekOffset}). Added ${filled} assignment(s).`,
        action: { type: 'FILL_WEEK' },
        scheduleUpdated: true,
      };
    }

    if (msg.includes('fill') && day && !shift && date) {
      const filled = await scheduleService.fillDay(date);
      return {
        reply: `Filled all shifts for ${day}. Added ${filled} new assignments.`,
        action: { type: 'FILL_DAY', date },
        scheduleUpdated: true,
      };
    }

    if (msg.includes('fill') && day && shift && date) {
      const filled = await scheduleService.fillShift(date, shift);
      return {
        reply: `Filled ${day} ${shift.toLowerCase()} — added ${filled} staff members.`,
        action: { type: 'FILL_SHIFT', date, shift },
        scheduleUpdated: true,
      };
    }

    if (msg.includes('clear') && day && shift && date) {
      await scheduleService.clearShift(date, shift);
      return {
        reply: `${day} ${shift.toLowerCase()} cleared. All workers are now unassigned for that block.`,
        action: { type: 'CLEAR_SHIFT', date, shift },
        scheduleUpdated: true,
      };
    }

    if (msgIncludes(msg, ['gap', 'understaff', 'missing'])) {
      const week = await scheduleService.getWeekSchedule(weekOffset);
      const gaps = week.days.flatMap((d) =>
        d.shifts
          .filter((s) => s.isUnderstaffed)
          .map((s) => `${d.dayLabel} ${s.shift.toLowerCase()}`),
      );
      return {
        reply: gaps.length
          ? `Found ${gaps.length} understaffed shift(s): ${gaps.join(', ')}.`
          : `No gaps this week — all shifts meet requirements.`,
        action: { type: 'SHOW_GAPS' },
        scheduleUpdated: false,
      };
    }

    if (msgIncludes(msg, ['who', 'show']) && day && date) {
      const week = await scheduleService.getWeekSchedule(weekOffset);
      const daySchedule = week.days.find((d) => d.date === date);

      if (!daySchedule) {
        return unknownReply(`Couldn't find schedule for ${day}.`);
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

    return unknownReply(
      `Try: "fill the week", "need 3 doctors on saturday morning", "swap Maria with James on monday morning", "clear overrides monday morning", "any gaps", or "who is working tuesday".`,
    );
  },
};
