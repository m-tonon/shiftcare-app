import { Role } from '@shared/types';

export const ROLE_COLORS: Record<
  Role,
  { bg: string; text: string; border: string }
> = {
  DOCTOR: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
  },
  NURSE: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
  },
  RECEPTIONIST: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300',
  },
  TECHNICIAN: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-300',
  },
  PHARMACIST: {
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    border: 'border-teal-300',
  },
  CLEANING: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
  },
};

export const ROLE_AVATAR_BG: Record<Role, string> = {
  DOCTOR: 'bg-blue-500',
  NURSE: 'bg-green-500',
  RECEPTIONIST: 'bg-purple-500',
  TECHNICIAN: 'bg-orange-500',
  PHARMACIST: 'bg-teal-500',
  CLEANING: 'bg-gray-500',
};

export const ROLE_LABELS: Record<Role, string> = {
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  RECEPTIONIST: 'Receptionist',
  TECHNICIAN: 'Technician',
  PHARMACIST: 'Pharmacist',
  CLEANING: 'Cleaning',
};
