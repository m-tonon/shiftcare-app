import { useState } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { ROLE_LABELS, ROLE_STYLES } from '../constants/roles.constants';
import { SHIFT_LABELS, SHIFT_TIMES } from '../constants/shifts.constants';
import { Role, ShiftName } from '@shared/types';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;
const DAY_LABELS: Record<string, string> = {
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
  FRI: 'Friday',
  SAT: 'Saturday',
  SUN: 'Sunday',
};
const SHIFTS: ShiftName[] = ['MORNING', 'AFTERNOON', 'EVENING'];
const ROLES: Role[] = [
  'DOCTOR',
  'NURSE',
  'RECEPTIONIST',
  'TECHNICIAN',
  'PHARMACIST',
  'CLEANING',
];

interface Rule {
  id: string;
  day: (typeof DAYS)[number];
  shift: ShiftName;
  role: Role;
  count: number;
}

const INITIAL_RULES: Rule[] = [
  { id: '1', day: 'MON', shift: 'MORNING', role: 'DOCTOR', count: 2 },
  { id: '2', day: 'MON', shift: 'MORNING', role: 'NURSE', count: 4 },
  { id: '3', day: 'MON', shift: 'AFTERNOON', role: 'DOCTOR', count: 1 },
  { id: '4', day: 'SAT', shift: 'MORNING', role: 'NURSE', count: 3 },
  { id: '5', day: 'SAT', shift: 'MORNING', role: 'RECEPTIONIST', count: 1 },
];

export default function AddSchedulePage() {
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [form, setForm] = useState<Omit<Rule, 'id'>>({
    day: 'MON',
    shift: 'MORNING',
    role: 'DOCTOR',
    count: 1,
  });
  const [saved, setSaved] = useState(false);

  const addRule = () => {
    setRules((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    setSaved(false);
  };

  const removeRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    setSaved(false);
  };

  const save = () => {
    // In a real app this would POST to the backend
    setSaved(true);
  };

  // Group rules by day for display
  const grouped = DAYS.reduce<Record<string, Rule[]>>(
    (acc, day) => {
      acc[day] = rules.filter((r) => r.day === day);
      return acc;
    },
    {} as Record<string, Rule[]>,
  );

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Page header */}
      <div className="flex-shrink-0 px-4 pt-5 pb-4 border-b border-border bg-background">
        <h1 className="text-[15px] font-semibold text-foreground">
          Shift Rules
        </h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Define how many staff are required per role, shift, and day.
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-5">
        {/* Add rule form */}
        <div className="bg-background border border-border rounded-xl p-4 flex flex-col gap-3">
          <p className="text-[12px] font-semibold text-foreground uppercase tracking-wide text-subtle">
            Add Rule
          </p>

          <div className="grid grid-cols-2 gap-2">
            {/* Day */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Day
              </label>
              <select
                value={form.day}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    day: e.target.value as (typeof DAYS)[number],
                  }))
                }
                className="h-9 px-2.5 text-[13px] bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {DAY_LABELS[d]}
                  </option>
                ))}
              </select>
            </div>

            {/* Shift */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Shift
              </label>
              <select
                value={form.shift}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shift: e.target.value as ShiftName }))
                }
                className="h-9 px-2.5 text-[13px] bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              >
                {SHIFTS.map((s) => (
                  <option key={s} value={s}>
                    {SHIFT_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value as Role }))
                }
                className="h-9 px-2.5 text-[13px] bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>

            {/* Count */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Count
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={form.count}
                onChange={(e) =>
                  setForm((f) => ({ ...f, count: Number(e.target.value) }))
                }
                className="h-9 px-2.5 text-[13px] bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              />
            </div>
          </div>

          <button
            onClick={addRule}
            className="flex items-center justify-center gap-2 h-9 bg-primary text-primary-foreground text-[13px] font-medium rounded-lg hover:bg-primary-hover transition-colors"
          >
            <Plus size={15} />
            Add Rule
          </button>
        </div>

        {/* Current rules grouped by day */}
        {DAYS.map((day) => {
          const dayRules = grouped[day];
          if (!dayRules.length) return null;
          return (
            <div key={day}>
              <p className="text-[11px] font-semibold text-subtle uppercase tracking-wider mb-2 px-1">
                {DAY_LABELS[day]}
              </p>
              <div className="flex flex-col gap-1.5">
                {dayRules.map((rule) => {
                  const roleStyles = ROLE_STYLES[rule.role];
                  return (
                    <div
                      key={rule.id}
                      className="flex items-center gap-3 px-3 py-2.5 bg-background border border-border rounded-lg"
                    >
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${roleStyles.chipBg} ${roleStyles.chipBorder} ${roleStyles.chipText}`}
                      >
                        {ROLE_LABELS[rule.role]}
                      </span>
                      <span className="text-[12px] text-muted-foreground flex-1">
                        {SHIFT_LABELS[rule.shift]} &middot;{' '}
                        {SHIFT_TIMES[rule.shift]}
                      </span>
                      <span className="text-[12px] font-semibold text-foreground tabular-nums">
                        &times;{rule.count}
                      </span>
                      <button
                        onClick={() => removeRule(rule.id)}
                        aria-label="Remove rule"
                        className="w-7 h-7 flex items-center justify-center rounded-md text-subtle hover:text-danger hover:bg-danger-bg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2 pb-24 md:pb-4">
          <button
            onClick={save}
            className={`h-11 rounded-xl text-[14px] font-semibold transition-colors ${
              saved
                ? 'bg-success-bg text-success border border-success-border'
                : 'bg-primary text-primary-foreground hover:bg-primary-hover'
            }`}
          >
            {saved ? 'Rules Saved' : 'Save Rules'}
          </button>
          <div className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-xl">
            <Sparkles size={14} className="text-primary flex-shrink-0" />
            <p className="text-[12px] text-muted-foreground leading-snug">
              Tip: You can also tell the AI &ldquo;schedule 3 nurses for Monday
              morning&rdquo; to add rules conversationally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
