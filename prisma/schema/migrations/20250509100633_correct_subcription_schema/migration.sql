/*
  Warnings:

  - You are about to drop the column `completedAt` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `NotificationSetting` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `NotificationSetting` table. All the data in the column will be lost.
  - You are about to drop the column `billingCycle` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `endsAt` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `planName` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `polarId` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `currentPeriodEnd` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Enrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "enrolledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("subscriptionId") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Enrollment" ("contentId", "enrolledAt", "id", "userId") SELECT "contentId", "enrolledAt", "id", "userId" FROM "Enrollment";
DROP TABLE "Enrollment";
ALTER TABLE "new_Enrollment" RENAME TO "Enrollment";
CREATE INDEX "Enrollment_subscriptionId_idx" ON "Enrollment"("subscriptionId");
CREATE INDEX "Enrollment_expiresAt_idx" ON "Enrollment"("expiresAt");
CREATE UNIQUE INDEX "Enrollment_userId_contentId_key" ON "Enrollment"("userId", "contentId");
CREATE TABLE "new_NotificationSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentUpdate" BOOLEAN NOT NULL DEFAULT true,
    "newContent" BOOLEAN NOT NULL DEFAULT true,
    "promotions" BOOLEAN NOT NULL DEFAULT false,
    "communityEvents" BOOLEAN NOT NULL DEFAULT true,
    "allNotifications" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    CONSTRAINT "NotificationSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_NotificationSetting" ("allNotifications", "communityEvents", "contentUpdate", "id", "newContent", "promotions", "userId") SELECT "allNotifications", "communityEvents", "contentUpdate", "id", "newContent", "promotions", "userId" FROM "NotificationSetting";
DROP TABLE "NotificationSetting";
ALTER TABLE "new_NotificationSetting" RENAME TO "NotificationSetting";
CREATE UNIQUE INDEX "NotificationSetting_userId_key" ON "NotificationSetting"("userId");
CREATE INDEX "NotificationSetting_userId_idx" ON "NotificationSetting"("userId");
CREATE TABLE "new_Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodEnd" DATETIME NOT NULL,
    "lastWebhookAt" DATETIME,
    "lastWebhookType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Subscription" ("createdAt", "id", "status", "updatedAt", "userId") SELECT "createdAt", "id", "status", "updatedAt", "userId" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");
CREATE UNIQUE INDEX "Subscription_subscriptionId_key" ON "Subscription"("subscriptionId");
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX "Subscription_productId_idx" ON "Subscription"("productId");
CREATE INDEX "Subscription_currentPeriodEnd_idx" ON "Subscription"("currentPeriodEnd");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
