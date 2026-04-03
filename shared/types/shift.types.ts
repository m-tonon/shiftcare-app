export type ShiftName = "MORNING" | "AFTERNOON" | "EVENING";

export interface ShiftDefinition {
  name: ShiftName;
  label: string;
  time: string;
}

export const SHIFTS: ShiftDefinition[] = [
  { name: "MORNING", label: "Morning", time: "7:00 AM – 3:00 PM" },
  { name: "AFTERNOON", label: "Afternoon", time: "3:00 PM – 11:00 PM" },
  { name: "EVENING", label: "Evening", time: "11:00 PM – 7:00 AM" },
];
