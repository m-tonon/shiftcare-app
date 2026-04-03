import { Role } from '@shared/types';

export interface RoleStyle {
  chipBg: string;
  chipText: string;
  chipBorder: string;
  avatarBg: string;
  cardBg: string;
  cardBorder: string;
  cardText: string;
}

export const ROLE_STYLES: Record<Role, RoleStyle> = {
  DOCTOR: {
    chipBg: 'bg-[var(--role-doctor-bg)]',
    chipText: 'text-[var(--role-doctor-text)]',
    chipBorder: 'border-[var(--role-doctor-border)]',
    avatarBg: 'bg-[var(--role-doctor-avatar)]',
    cardBg: 'bg-[var(--role-doctor-bg)]',
    cardBorder: 'border-[var(--role-doctor-border)]',
    cardText: 'text-[var(--role-doctor-text)]',
  },
  NURSE: {
    chipBg: 'bg-[var(--role-nurse-bg)]',
    chipText: 'text-[var(--role-nurse-text)]',
    chipBorder: 'border-[var(--role-nurse-border)]',
    avatarBg: 'bg-[var(--role-nurse-avatar)]',
    cardBg: 'bg-[var(--role-nurse-bg)]',
    cardBorder: 'border-[var(--role-nurse-border)]',
    cardText: 'text-[var(--role-nurse-text)]',
  },
  RECEPTIONIST: {
    chipBg: 'bg-[var(--role-receptionist-bg)]',
    chipText: 'text-[var(--role-receptionist-text)]',
    chipBorder: 'border-[var(--role-receptionist-border)]',
    avatarBg: 'bg-[var(--role-receptionist-avatar)]',
    cardBg: 'bg-[var(--role-receptionist-bg)]',
    cardBorder: 'border-[var(--role-receptionist-border)]',
    cardText: 'text-[var(--role-receptionist-text)]',
  },
  TECHNICIAN: {
    chipBg: 'bg-[var(--role-technician-bg)]',
    chipText: 'text-[var(--role-technician-text)]',
    chipBorder: 'border-[var(--role-technician-border)]',
    avatarBg: 'bg-[var(--role-technician-avatar)]',
    cardBg: 'bg-[var(--role-technician-bg)]',
    cardBorder: 'border-[var(--role-technician-border)]',
    cardText: 'text-[var(--role-technician-text)]',
  },
  PHARMACIST: {
    chipBg: 'bg-[var(--role-pharmacist-bg)]',
    chipText: 'text-[var(--role-pharmacist-text)]',
    chipBorder: 'border-[var(--role-pharmacist-border)]',
    avatarBg: 'bg-[var(--role-pharmacist-avatar)]',
    cardBg: 'bg-[var(--role-pharmacist-bg)]',
    cardBorder: 'border-[var(--role-pharmacist-border)]',
    cardText: 'text-[var(--role-pharmacist-text)]',
  },
  CLEANING: {
    chipBg: 'bg-[var(--role-cleaning-bg)]',
    chipText: 'text-[var(--role-cleaning-text)]',
    chipBorder: 'border-[var(--role-cleaning-border)]',
    avatarBg: 'bg-[var(--role-cleaning-avatar)]',
    cardBg: 'bg-[var(--role-cleaning-bg)]',
    cardBorder: 'border-[var(--role-cleaning-border)]',
    cardText: 'text-[var(--role-cleaning-text)]',
  },
};

// Keep legacy exports for backwards compat
export const ROLE_COLORS: Record<
  Role,
  { bg: string; text: string; border: string }
> = {
  DOCTOR: {
    bg: ROLE_STYLES.DOCTOR.chipBg,
    text: ROLE_STYLES.DOCTOR.chipText,
    border: ROLE_STYLES.DOCTOR.chipBorder,
  },
  NURSE: {
    bg: ROLE_STYLES.NURSE.chipBg,
    text: ROLE_STYLES.NURSE.chipText,
    border: ROLE_STYLES.NURSE.chipBorder,
  },
  RECEPTIONIST: {
    bg: ROLE_STYLES.RECEPTIONIST.chipBg,
    text: ROLE_STYLES.RECEPTIONIST.chipText,
    border: ROLE_STYLES.RECEPTIONIST.chipBorder,
  },
  TECHNICIAN: {
    bg: ROLE_STYLES.TECHNICIAN.chipBg,
    text: ROLE_STYLES.TECHNICIAN.chipText,
    border: ROLE_STYLES.TECHNICIAN.chipBorder,
  },
  PHARMACIST: {
    bg: ROLE_STYLES.PHARMACIST.chipBg,
    text: ROLE_STYLES.PHARMACIST.chipText,
    border: ROLE_STYLES.PHARMACIST.chipBorder,
  },
  CLEANING: {
    bg: ROLE_STYLES.CLEANING.chipBg,
    text: ROLE_STYLES.CLEANING.chipText,
    border: ROLE_STYLES.CLEANING.chipBorder,
  },
};

export const ROLE_AVATAR_BG: Record<Role, string> = {
  DOCTOR: ROLE_STYLES.DOCTOR.avatarBg,
  NURSE: ROLE_STYLES.NURSE.avatarBg,
  RECEPTIONIST: ROLE_STYLES.RECEPTIONIST.avatarBg,
  TECHNICIAN: ROLE_STYLES.TECHNICIAN.avatarBg,
  PHARMACIST: ROLE_STYLES.PHARMACIST.avatarBg,
  CLEANING: ROLE_STYLES.CLEANING.avatarBg,
};

export const ROLE_LABELS: Record<Role, string> = {
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  RECEPTIONIST: 'Receptionist',
  TECHNICIAN: 'Technician',
  PHARMACIST: 'Pharmacist',
  CLEANING: 'Cleaning',
};

export const ROLE_DISPLAY_ORDER: readonly Role[] = [
  'DOCTOR',
  'NURSE',
  'PHARMACIST',
  'TECHNICIAN',
  'RECEPTIONIST',
  'CLEANING',
] as const;
