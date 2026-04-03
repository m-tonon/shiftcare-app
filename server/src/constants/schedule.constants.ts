export const SHIFT_NAMES = ["MORNING", "AFTERNOON", "EVENING"] as const;

export const ROLE_REQUIRED_PER_SHIFT: Record<string, Record<string, number>> = {
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
