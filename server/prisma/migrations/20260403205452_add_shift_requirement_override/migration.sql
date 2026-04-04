-- CreateTable
CREATE TABLE "ShiftRequirementOverride" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "shift" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "requiredCount" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ShiftRequirementOverride_date_shift_role_key" ON "ShiftRequirementOverride"("date", "shift", "role");
