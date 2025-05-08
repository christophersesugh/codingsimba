/*
  Warnings:

  - You are about to drop the `Verification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `totalLikes` on the `Content` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Verification_type_target_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Verification";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sanityId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Content" ("createdAt", "id", "sanityId", "type", "updatedAt", "views") SELECT "createdAt", "id", "sanityId", "type", "updatedAt", "views" FROM "Content";
DROP TABLE "Content";
ALTER TABLE "new_Content" RENAME TO "Content";
CREATE UNIQUE INDEX "Content_sanityId_key" ON "Content"("sanityId");
CREATE INDEX "Content_sanityId_idx" ON "Content"("sanityId");
CREATE INDEX "Content_sanityId_type_idx" ON "Content"("sanityId", "type");
CREATE INDEX "Content_type_createdAt_idx" ON "Content"("type", "createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");
