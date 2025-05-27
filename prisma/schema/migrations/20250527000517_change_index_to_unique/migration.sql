/*
  Warnings:

  - A unique constraint covering the columns `[target,type]` on the table `Verification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Verification_type_target_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Verification_target_type_key" ON "Verification"("target", "type");
