export type Role =
  | "DOCTOR"
  | "NURSE"
  | "RECEPTIONIST"
  | "TECHNICIAN"
  | "PHARMACIST"
  | "CLEANING";

export type Availability = "AVAILABLE" | "SICK" | "VACATION";

export interface Worker {
  id: number;
  name: string;
  role: Role;
  availability: Availability;
}
