import Anthropic from '@anthropic-ai/sdk';
import { scheduleService } from './schedule.service';
import { ChatResponse, ShiftName } from '@shared/types';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a scheduling assistant for a staffing app.

When the user sends a message, respond ONLY with a JSON object — no explanation, no markdown, no extra text.

Available actions:

// Fill operations
{ "action": "FILL_WEEK" }
{ "action": "FILL_DAY", "day": "monday" }
{ "action": "FILL_SHIFT", "day": "monday", "shift": "MORNING" }

// Clear operations
{ "action": "CLEAR_SHIFT", "day": "monday", "shift": "MORNING" }
{ "action": "CLEAR_OVERRIDES", "day": "monday", "shift": "MORNING" }
{ "action": "CLEAR_OVERRIDES", "day": "monday", "shift": null }

// View operations
{ "action": "SHOW_GAPS" }
{ "action": "SHOW_WORKERS", "day": "monday" }

// Define staffing rules for one role at a time
{ "action": "SET_REQUIREMENT", "day": "monday", "shift": "MORNING", "role": "NURSE", "count": 3 }
{ "action": "SET_REQUIREMENT", "day": "weekend", "shift": null, "role": "DOCTOR", "count": 1 }

// Define staffing rules for multiple roles at once
{
  "action": "SET_REQUIREMENTS_BULK",
  "day": "weekend",
  "shift": null,
  "rules": [
    { "role": "DOCTOR", "count": 1 },
    { "role": "NURSE", "count": 3 },
    { "role": "RECEPTIONIST", "count": 1 },
    { "role": "CLEANING", "count": 2 }
  ]
}

// Swap a worker and auto-fill gaps
{ "action": "SWAP_WORKER", "day": "monday", "shift": "MORNING", "from": "Maria", "to": "James" }

// Unknown / out of scope
{ "action": "UNKNOWN", "reply": "your helpful response here" }

Rules:
- day: monday, tuesday, wednesday, thursday, friday, saturday, sunday, or weekend
- shift: MORNING, AFTERNOON, EVENING, or null (means all shifts)
- role: DOCTOR, NURSE, RECEPTIONIST, TECHNICIAN, PHARMACIST, CLEANING
- Use SET_REQUIREMENTS_BULK when the user defines multiple roles at once ("on weekends we need 2 doctors and 3 nurses")
- Use SET_REQUIREMENT for a single role change
- For UNKNOWN write a helpful reply with examples of what the user can ask`;

type ParsedAction =
  | { action: 'FILL_WEEK' }
  | { action: 'FILL_DAY'; day: string }
  | { action: 'FILL_SHIFT'; day: string; shift: ShiftName }
  | { action: 'CLEAR_SHIFT'; day: string; shift: ShiftName }
  | { action: 'CLEAR_OVERRIDES'; day: string; shift: ShiftName | null }
  | { action: 'SHOW_GAPS' }
  | { action: 'SHOW_WORKERS'; day: string }
  | {
      action: 'SET_REQUIREMENT';
      day: string;
      shift: ShiftName | null;
      role: string;
      count: number;
    }
  | {
      action: 'SET_REQUIREMENTS_BULK';
      day: string;
      shift: ShiftName | null;
      rules: { role: string; count: number }[];
    }
  | {
      action: 'SWAP_WORKER';
      day: string;
      shift: ShiftName;
      from: string;
      to: string;
    }
  | { action: 'UNKNOWN'; reply: string };

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

function resolveDateForDay(
  day: string,
  weekOffset: number,
): string | undefined {
  const dates = scheduleService.getWeekDates(weekOffset);
  const idx = DAYS.indexOf(day as (typeof DAYS)[number]);
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

function resolveShifts(shift: ShiftName | null): ShiftName[] {
  return shift ? [shift] : ['MORNING', 'AFTERNOON', 'EVENING'];
}

async function parseWithClaude(message: string): Promise<ParsedAction> {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: message }],
  });

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  try {
    return JSON.parse(text) as ParsedAction;
  } catch {
    return {
      action: 'UNKNOWN',
      reply:
        'Could not understand that. Try: "on weekends we need 2 doctors and 3 nurses", "fill the week", "swap Maria with James on monday morning".',
    };
  }
}

export const chatService = {
  processMessage: async (
    message: string,
    weekOffset = 0,
  ): Promise<ChatResponse> => {
    const parsed = await parseWithClaude(message);

    switch (parsed.action) {
      case 'SET_REQUIREMENT': {
        const dates = resolveDatesForToken(parsed.day, weekOffset);
        if (!dates.length)
          return {
            reply: "Couldn't resolve that day.",
            action: { type: 'UNKNOWN' },
            scheduleUpdated: false,
          };
        const shifts = resolveShifts(parsed.shift);
        for (const date of dates) {
          for (const shift of shifts) {
            await scheduleService.setRequirementOverride(
              date,
              shift,
              parsed.role,
              parsed.count,
            );
          }
        }
        return {
          reply: `Set ${parsed.count} ${parsed.role}(s) per ${parsed.shift ?? 'each shift'} on ${parsed.day}. Say "fill ${parsed.day}" to assign people.`,
          action: { type: 'SET_REQUIREMENT', date: dates[0], shift: shifts[0] },
          scheduleUpdated: true,
        };
      }

      case 'SET_REQUIREMENTS_BULK': {
        const dates = resolveDatesForToken(parsed.day, weekOffset);
        if (!dates.length)
          return {
            reply: "Couldn't resolve that day.",
            action: { type: 'UNKNOWN' },
            scheduleUpdated: false,
          };
        const shifts = resolveShifts(parsed.shift);
        for (const date of dates) {
          for (const shift of shifts) {
            for (const rule of parsed.rules) {
              await scheduleService.setRequirementOverride(
                date,
                shift,
                rule.role,
                rule.count,
              );
            }
          }
        }
        const summary = parsed.rules
          .map((r) => `${r.count} ${r.role}(s)`)
          .join(', ');
        return {
          reply: `Updated ${parsed.day} requirements: ${summary} per ${parsed.shift ?? 'each shift'}. Say "fill ${parsed.day}" to assign people.`,
          action: { type: 'SET_REQUIREMENT', date: dates[0], shift: shifts[0] },
          scheduleUpdated: true,
        };
      }

      case 'FILL_WEEK': {
        const filled = await scheduleService.fillWeek(weekOffset);
        return {
          reply: `Filled the week. Added ${filled} assignment(s).`,
          action: { type: 'FILL_WEEK' },
          scheduleUpdated: true,
        };
      }

      case 'FILL_DAY': {
        const date = resolveDateForDay(parsed.day, weekOffset);
        if (!date)
          return {
            reply: "Couldn't resolve that day.",
            action: { type: 'UNKNOWN' },
            scheduleUpdated: false,
          };
        const filled = await scheduleService.fillDay(date);
        return {
          reply: `Filled all shifts for ${parsed.day}. Added ${filled} assignment(s).`,
          action: { type: 'FILL_DAY', date },
          scheduleUpdated: true,
        };
      }

      case 'FILL_SHIFT': {
        const date = resolveDateForDay(parsed.day, weekOffset);
        if (!date)
          return {
            reply: "Couldn't resolve that day.",
            action: { type: 'UNKNOWN' },
            scheduleUpdated: false,
          };
        const filled = await scheduleService.fillShift(date, parsed.shift);
        return {
          reply: `Filled ${parsed.day} ${parsed.shift.toLowerCase()} — added ${filled} staff.`,
          action: { type: 'FILL_SHIFT', date, shift: parsed.shift },
          scheduleUpdated: true,
        };
      }

      case 'CLEAR_SHIFT': {
        const date = resolveDateForDay(parsed.day, weekOffset);
        if (!date)
          return {
            reply: "Couldn't resolve that day.",
            action: { type: 'UNKNOWN' },
            scheduleUpdated: false,
          };
        await scheduleService.clearShift(date, parsed.shift);
        return {
          reply: `${parsed.day} ${parsed.shift.toLowerCase()} cleared.`,
          action: { type: 'CLEAR_SHIFT', date, shift: parsed.shift },
          scheduleUpdated: true,
        };
      }

      case 'CLEAR_OVERRIDES': {
        const date = resolveDateForDay(parsed.day, weekOffset);
        if (!date)
          return {
            reply: "Couldn't resolve that day.",
            action: { type: 'UNKNOWN' },
            scheduleUpdated: false,
          };
        const shifts = resolveShifts(parsed.shift);
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
              ? `Cleared ${total} override(s) for ${parsed.day}.`
              : `No overrides found for ${parsed.day}.`,
          action: { type: 'CLEAR_SHIFT_OVERRIDES', date },
          scheduleUpdated: true,
        };
      }

      case 'SHOW_GAPS': {
        const week = await scheduleService.getWeekSchedule(weekOffset);
        const gaps = week.days.flatMap((d) =>
          d.shifts
            .filter((s) => s.isUnderstaffed)
            .map((s) => `${d.dayLabel} ${s.shift.toLowerCase()}`),
        );
        return {
          reply: gaps.length
            ? `Understaffed: ${gaps.join(', ')}.`
            : 'No gaps — all shifts are covered.',
          action: { type: 'SHOW_GAPS' },
          scheduleUpdated: false,
        };
      }

      case 'SHOW_WORKERS': {
        const date = resolveDateForDay(parsed.day, weekOffset);
        if (!date)
          return {
            reply: "Couldn't resolve that day.",
            action: { type: 'UNKNOWN' },
            scheduleUpdated: false,
          };
        const week = await scheduleService.getWeekSchedule(weekOffset);
        const day = week.days.find((d) => d.date === date);
        if (!day)
          return {
            reply: `No schedule found for ${parsed.day}.`,
            action: { type: 'UNKNOWN' },
            scheduleUpdated: false,
          };
        const lines = day.shifts.map((s) => {
          const names = s.slots
            .map((sl) => sl.worker?.name ?? '')
            .filter(Boolean)
            .join(', ');
          return `${s.shift}: ${names || 'nobody assigned'}`;
        });
        return {
          reply: `${day.dayLabel}:\n${lines.join('\n')}`,
          action: { type: 'SHOW_WORKERS', date },
          scheduleUpdated: false,
        };
      }

      case 'SWAP_WORKER': {
        const date = resolveDateForDay(parsed.day, weekOffset);
        if (!date)
          return {
            reply: "Couldn't resolve that day.",
            action: { type: 'UNKNOWN' },
            scheduleUpdated: false,
          };
        const result = await scheduleService.swapWorkerOnShift(
          date,
          parsed.shift,
          parsed.from,
          parsed.to,
        );
        return {
          reply: result.message,
          action: {
            type: 'SWAP_WORKER',
            date,
            shift: parsed.shift,
            workerName: parsed.to,
          },
          scheduleUpdated: result.swapped,
        };
      }

      case 'UNKNOWN':
      default:
        return {
          reply:
            parsed.reply ??
            'Try: "on weekends we need 2 doctors and 3 nurses", "fill the week", "swap Maria with James on monday morning", "any gaps".',
          action: { type: 'UNKNOWN' },
          scheduleUpdated: false,
        };
    }
  },
};
