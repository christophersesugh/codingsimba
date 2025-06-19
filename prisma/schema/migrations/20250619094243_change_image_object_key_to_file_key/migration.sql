/*
  Warnings:

  - You are about to drop the column `objectKey` on the `UserImage` table. All the data in the column will be lost.
  - Added the required column `fileKey` to the `UserImage` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileKey" TEXT NOT NULL,
    "altText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "UserImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserImage" ("altText", "createdAt", "id", "updatedAt", "userId") SELECT "altText", "createdAt", "id", "updatedAt", "userId" FROM "UserImage";
DROP TABLE "UserImage";
ALTER TABLE "new_UserImage" RENAME TO "UserImage";
CREATE UNIQUE INDEX "UserImage_userId_key" ON "UserImage"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
