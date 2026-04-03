import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const workers = [
  { name: "Dr. James Johnson", role: "DOCTOR", availability: "AVAILABLE" },
  { name: "Dr. Sarah Chen", role: "DOCTOR", availability: "AVAILABLE" },
  { name: "Dr. Robert Miller", role: "DOCTOR", availability: "SICK" },
  { name: "Dr. Emily Davis", role: "DOCTOR", availability: "AVAILABLE" },
  { name: "Nurse Maria Garcia", role: "NURSE", availability: "AVAILABLE" },
  { name: "Nurse James Wilson", role: "NURSE", availability: "AVAILABLE" },
  { name: "Nurse Linda Martinez", role: "NURSE", availability: "VACATION" },
  { name: "Nurse Kevin Thompson", role: "NURSE", availability: "AVAILABLE" },
  { name: "Nurse Ashley Brown", role: "NURSE", availability: "AVAILABLE" },
  { name: "Nurse Daniel Lee", role: "NURSE", availability: "AVAILABLE" },
  { name: "Rita Patel", role: "RECEPTIONIST", availability: "AVAILABLE" },
  { name: "Tom Harris", role: "RECEPTIONIST", availability: "AVAILABLE" },
  { name: "Susan Clark", role: "RECEPTIONIST", availability: "SICK" },
  { name: "Carlos Rivera", role: "TECHNICIAN", availability: "AVAILABLE" },
  { name: "Amy Scott", role: "TECHNICIAN", availability: "AVAILABLE" },
  { name: "Brian Adams", role: "TECHNICIAN", availability: "AVAILABLE" },
  { name: "Dr. Nancy White", role: "PHARMACIST", availability: "AVAILABLE" },
  { name: "Mark Taylor", role: "PHARMACIST", availability: "AVAILABLE" },
  { name: "Joe Lewis", role: "CLEANING", availability: "AVAILABLE" },
  { name: "Paula King", role: "CLEANING", availability: "AVAILABLE" },
];

const shiftRules = [
  { shift: "MORNING", role: "DOCTOR", requiredCount: 2 },
  { shift: "MORNING", role: "NURSE", requiredCount: 3 },
  { shift: "MORNING", role: "RECEPTIONIST", requiredCount: 1 },
  { shift: "MORNING", role: "TECHNICIAN", requiredCount: 1 },
  { shift: "MORNING", role: "PHARMACIST", requiredCount: 1 },
  { shift: "MORNING", role: "CLEANING", requiredCount: 1 },
  { shift: "AFTERNOON", role: "DOCTOR", requiredCount: 2 },
  { shift: "AFTERNOON", role: "NURSE", requiredCount: 2 },
  { shift: "AFTERNOON", role: "RECEPTIONIST", requiredCount: 1 },
  { shift: "AFTERNOON", role: "TECHNICIAN", requiredCount: 1 },
  { shift: "AFTERNOON", role: "PHARMACIST", requiredCount: 1 },
  { shift: "AFTERNOON", role: "CLEANING", requiredCount: 1 },
  { shift: "EVENING", role: "DOCTOR", requiredCount: 1 },
  { shift: "EVENING", role: "NURSE", requiredCount: 2 },
  { shift: "EVENING", role: "RECEPTIONIST", requiredCount: 1 },
  { shift: "EVENING", role: "TECHNICIAN", requiredCount: 1 },
  { shift: "EVENING", role: "PHARMACIST", requiredCount: 1 },
  { shift: "EVENING", role: "CLEANING", requiredCount: 1 },
];

function getWeekDates(): string[] {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

// Intentional gaps: skip some days/shifts so AI chat has something to fix
const GAPS = new Set([
  "TUESDAY-EVENING",
  "THURSDAY-AFTERNOON",
  "SATURDAY-MORNING",
  "SUNDAY-EVENING",
]);

async function main() {
  await prisma.scheduleSlot.deleteMany();
  await prisma.shiftRule.deleteMany();
  await prisma.worker.deleteMany();

  // Seed workers
  for (const w of workers) {
    await prisma.worker.create({ data: w });
  }

  // Seed shift rules
  for (const r of shiftRules) {
    await prisma.shiftRule.create({ data: r });
  }

  const allWorkers = await prisma.worker.findMany();
  const dates = getWeekDates();
  const shifts = ["MORNING", "AFTERNOON", "EVENING"] as const;

  for (const date of dates) {
    for (const shift of shifts) {
      const dayName = new Date(date + "T12:00:00")
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase();

      if (GAPS.has(`${dayName}-${shift}`)) continue;

      const rules = shiftRules.filter((r) => r.shift === shift);

      for (const rule of rules) {
        const available = allWorkers.filter(
          (w) => w.role === rule.role && w.availability === "AVAILABLE",
        );

        const toAssign = available.slice(0, rule.requiredCount);

        for (const worker of toAssign) {
          await prisma.scheduleSlot.upsert({
            where: {
              date_shift_workerId: { date, shift, workerId: worker.id },
            },
            update: {},
            create: { date, shift, workerId: worker.id },
          });
        }
      }
    }
  }

  console.log("✅ 20 workers seeded");
  console.log("✅ Shift rules seeded");
  console.log("✅ Current week schedule seeded with intentional gaps");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
