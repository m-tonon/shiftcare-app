import { Worker, Role } from './worker.types';
import { ShiftName } from './shift.types';

export interface RoleRequirement {
  role: Role;
  required: number;
  actual: number;
}

export interface ScheduleSlot {
  id: number;
  date: string;
  shift: ShiftName;
  workerId: number;
  worker?: Worker;
}

export interface ShiftSlots {
  shift: ShiftName;
  slots: ScheduleSlot[];
  requiredCount: number;
  isUnderstaffed: boolean;
  roleRequirements?: RoleRequirement[];
}

export interface DaySchedule {
  date: string;
  dayLabel: string;
  shifts: ShiftSlots[];
}

export interface WeekSchedule {
  days: DaySchedule[];
}

export interface FillResult {
  filled: number;
  date: string;
  shift: ShiftName;
}

export interface FillShiftDto {
  date: string;
  shift: ShiftName;
}

export interface SwapWorkerDto {
  workerId: number;
  date: string;
  shift: ShiftName;
}

export interface ClearShiftDto {
  date: string;
  shift: ShiftName;
}
