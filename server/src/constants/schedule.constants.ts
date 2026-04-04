export const SHIFT_NAMES = ['MORNING', 'AFTERNOON', 'EVENING'] as const;

/** Staffing matrix for Mon–Fri (local calendar day from schedule date). */
export const WEEKDAY_ROLE_REQUIRED_PER_SHIFT: Record<
  string,
  Record<string, number>
> = {
  MORNING: {
    DOCTOR: 2,
    NURSE: 3,
    RECEPTIONIST: 1,
    TECHNICIAN: 1,
    PHARMACIST: 1,
    CLEANING: 1,
  },
  AFTERNOON: {
    DOCTOR: 2,
    NURSE: 2,
    RECEPTIONIST: 1,
    TECHNICIAN: 1,
    PHARMACIST: 1,
    CLEANING: 1,
  },
  EVENING: {
    DOCTOR: 1,
    NURSE: 2,
    RECEPTIONIST: 1,
    TECHNICIAN: 1,
    PHARMACIST: 1,
    CLEANING: 1,
  },
};

/** Staffing matrix for Sat–Sun (reduced coverage vs weekdays). */
export const WEEKEND_ROLE_REQUIRED_PER_SHIFT: Record<
  string,
  Record<string, number>
> = {
  MORNING: {
    DOCTOR: 1,
    NURSE: 2,
    RECEPTIONIST: 1,
    TECHNICIAN: 1,
    PHARMACIST: 1,
    CLEANING: 1,
  },
  AFTERNOON: {
    DOCTOR: 1,
    NURSE: 2,
    RECEPTIONIST: 1,
    TECHNICIAN: 1,
    PHARMACIST: 1,
    CLEANING: 1,
  },
  EVENING: {
    DOCTOR: 1,
    NURSE: 1,
    RECEPTIONIST: 1,
    TECHNICIAN: 1,
    PHARMACIST: 1,
    CLEANING: 1,
  },
};

export type HardCodedShiftRule = {
  shift: string;
  role: string;
  requiredCount: number;
};

export function isWeekendDate(date: string): boolean {
  const dow = new Date(`${date}T12:00:00`).getDay();
  return dow === 0 || dow === 6;
}

/** Resolved staffing rules for a calendar date (weekday vs weekend). */
export function getShiftRulesForDate(date: string): HardCodedShiftRule[] {
  const table = isWeekendDate(date)
    ? WEEKEND_ROLE_REQUIRED_PER_SHIFT
    : WEEKDAY_ROLE_REQUIRED_PER_SHIFT;

  const rows: HardCodedShiftRule[] = [];
  for (const shift of SHIFT_NAMES) {
    const perRole = table[shift];
    for (const [role, requiredCount] of Object.entries(perRole)) {
      rows.push({ shift, role, requiredCount });
    }
  }
  return rows;
}
