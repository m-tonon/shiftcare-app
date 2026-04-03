-- CreateTable
CREATE TABLE "Worker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "availability" TEXT NOT NULL DEFAULT 'AVAILABLE'
);

-- CreateTable
CREATE TABLE "ScheduleSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "shift" TEXT NOT NULL,
    "workerId" INTEGER NOT NULL,
    CONSTRAINT "ScheduleSlot_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShiftRule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shift" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "requiredCount" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleSlot_date_shift_workerId_key" ON "ScheduleSlot"("date", "shift", "workerId");

-- CreateIndex
CREATE UNIQUE INDEX "ShiftRule_shift_role_key" ON "ShiftRule"("shift", "role");
