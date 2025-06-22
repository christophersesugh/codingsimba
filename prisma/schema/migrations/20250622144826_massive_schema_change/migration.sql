/*
  Warnings:

  - You are about to drop the `CourseProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ModuleProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgramProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `isCourse` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `TimeSpent` table. All the data in the column will be lost.
  - You are about to drop the column `courseProgressId` on the `TimeSpent` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `TimeSpent` table. All the data in the column will be lost.
  - You are about to drop the column `moduleProgressId` on the `TimeSpent` table. All the data in the column will be lost.
  - You are about to drop the column `pageType` on the `TimeSpent` table. All the data in the column will be lost.
  - You are about to drop the column `programProgressId` on the `TimeSpent` table. All the data in the column will be lost.
  - You are about to drop the column `timeSpent` on the `TimeSpent` table. All the data in the column will be lost.
  - You are about to drop the column `polarCustomerId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerName,userId]` on the table `Connection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Connection_userId_key";

-- DropIndex
DROP INDEX "CourseProgress_userId_contentId_key";

-- DropIndex
DROP INDEX "CourseProgress_contentId_idx";

-- DropIndex
DROP INDEX "CourseProgress_userId_idx";

-- DropIndex
DROP INDEX "CourseProgress_userId_isCompleted_idx";

-- DropIndex
DROP INDEX "ModuleProgress_courseProgressId_userId_idx";

-- DropIndex
DROP INDEX "ModuleProgress_userId_isCompleted_idx";

-- DropIndex
DROP INDEX "ModuleProgress_courseProgressId_idx";

-- DropIndex
DROP INDEX "ModuleProgress_userId_idx";

-- DropIndex
DROP INDEX "ModuleProgress_sanityId_key";

-- DropIndex
DROP INDEX "ProgramProgress_userId_contentId_key";

-- DropIndex
DROP INDEX "ProgramProgress_contentId_idx";

-- DropIndex
DROP INDEX "ProgramProgress_userId_idx";

-- DropIndex
DROP INDEX "ProgramProgress_userId_isCompleted_idx";

-- DropIndex
DROP INDEX "UserImage_userId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CourseProgress";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ModuleProgress";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProgramProgress";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserImage";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'INFO',
    "category" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "retentionDays" INTEGER,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" TEXT,
    "targetUserId" TEXT,
    "teamId" TEXT,
    "targetMemberId" TEXT,
    "targetCourseId" TEXT,
    "targetAdminId" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_targetMemberId_fkey" FOREIGN KEY ("targetMemberId") REFERENCES "TeamMember" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_targetCourseId_fkey" FOREIGN KEY ("targetCourseId") REFERENCES "Course" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_targetAdminId_fkey" FOREIGN KEY ("targetAdminId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLogDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "field" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "changeType" TEXT NOT NULL,
    "auditLogId" TEXT NOT NULL,
    CONSTRAINT "AuditLogDetail_auditLogId_fkey" FOREIGN KEY ("auditLogId") REFERENCES "AuditLog" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLogExport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "downloadUrl" TEXT,
    "expiresAt" DATETIME,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "modules" JSONB,
    "actions" JSONB,
    "categories" JSONB,
    "teamId" TEXT,
    "requestedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AuditLogExport_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AuditLogExport_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MonthlyChallenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "theme" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'MEDIUM',
    "points" INTEGER NOT NULL DEFAULT 100,
    "template" JSONB,
    "hints" JSONB,
    "solution" TEXT,
    "monthlyChallengeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Challenge_monthlyChallengeId_fkey" FOREIGN KEY ("monthlyChallengeId") REFERENCES "MonthlyChallenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChallengeTestCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "isExample" BOOLEAN NOT NULL DEFAULT false,
    "challengeId" TEXT NOT NULL,
    CONSTRAINT "ChallengeTestCase_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChallengeSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "score" INTEGER NOT NULL DEFAULT 0,
    "executionTime" INTEGER,
    "memoryUsage" INTEGER,
    "result" JSONB,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChallengeSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChallengeSubmission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserChallenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "currentCode" TEXT,
    "currentLanguage" TEXT,
    "viewedSolutionAt" DATETIME,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserChallenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserChallengeBadge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "submissionId" TEXT,
    CONSTRAINT "UserChallengeBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserChallengeBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserChallengeBadge_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ChallengeSubmission" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scope" TEXT NOT NULL DEFAULT 'GLOBAL',
    "language" TEXT,
    "month" INTEGER,
    "year" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rank" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "leaderboardId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LeaderboardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LeaderboardEntry_leaderboardId_fkey" FOREIGN KEY ("leaderboardId") REFERENCES "Leaderboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sanityId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'LOCKED',
    "userId" TEXT NOT NULL,
    CONSTRAINT "Program_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sanityId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'LOCKED',
    "userId" TEXT NOT NULL,
    "programId" TEXT,
    CONSTRAINT "Course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Course_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sanityId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'LOCKED',
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    CONSTRAINT "Module_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubModule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sanityId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'LOCKED',
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    CONSTRAINT "SubModule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SubModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sanityId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'LOCKED',
    "userId" TEXT NOT NULL,
    "subModuleId" TEXT NOT NULL,
    CONSTRAINT "Lesson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Lesson_subModuleId_fkey" FOREIGN KEY ("subModuleId") REFERENCES "SubModule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileKey" TEXT NOT NULL,
    "filePath" TEXT NOT NULL DEFAULT 'users',
    "altText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "teamCertificateId" TEXT NOT NULL,
    "teamSettingsId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Image_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Image_teamCertificateId_fkey" FOREIGN KEY ("teamCertificateId") REFERENCES "TeamCertificate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Image_teamSettingsId_fkey" FOREIGN KEY ("teamSettingsId") REFERENCES "TeamSettings" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Image_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "maxMembers" INTEGER NOT NULL DEFAULT 10,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "allowInvites" BOOLEAN NOT NULL DEFAULT true,
    "requireApproval" BOOLEAN NOT NULL DEFAULT false,
    "totalProgress" INTEGER NOT NULL DEFAULT 0,
    "averageProgress" REAL NOT NULL DEFAULT 0,
    "lastActivityAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "totalProgress" INTEGER NOT NULL DEFAULT 0,
    "coursesCompleted" INTEGER NOT NULL DEFAULT 0,
    "certificatesEarned" INTEGER NOT NULL DEFAULT 0,
    "lastActivityAt" DATETIME,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamInvite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "expiresAt" DATETIME NOT NULL,
    "invitedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamId" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    CONSTRAINT "TeamInvite_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamInvite_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamLearningPath" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "teamId" TEXT NOT NULL,
    CONSTRAINT "TeamLearningPath_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamLearningPathCourse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "learningPathId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    CONSTRAINT "TeamLearningPathCourse_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "TeamLearningPath" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamLearningPathCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamCertificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "teamId" TEXT NOT NULL,
    CONSTRAINT "TeamCertificate_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamMemberCertificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "teamId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL,
    CONSTRAINT "TeamMemberCertificate_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamMemberCertificate_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TeamMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamMemberCertificate_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "TeamCertificate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "metric" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "metadata" JSONB,
    "teamId" TEXT NOT NULL,
    CONSTRAINT "TeamAnalytics_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamMemberAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "metric" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "metadata" JSONB,
    "memberId" TEXT NOT NULL,
    CONSTRAINT "TeamMemberAnalytics_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TeamMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamIntegration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB NOT NULL,
    "lastSyncAt" DATETIME,
    "teamId" TEXT NOT NULL,
    CONSTRAINT "TeamIntegration_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "slackNotifications" BOOLEAN NOT NULL DEFAULT false,
    "weeklyReports" BOOLEAN NOT NULL DEFAULT true,
    "autoEnrollNewMembers" BOOLEAN NOT NULL DEFAULT false,
    "defaultLearningPath" TEXT,
    "requireCompletion" BOOLEAN NOT NULL DEFAULT false,
    "publicProfile" BOOLEAN NOT NULL DEFAULT false,
    "showMemberProgress" BOOLEAN NOT NULL DEFAULT true,
    "allowMemberInvites" BOOLEAN NOT NULL DEFAULT true,
    "customColors" JSONB,
    "customDomain" TEXT,
    "teamId" TEXT NOT NULL,
    CONSTRAINT "TeamSettings_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_RoleToTeamMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RoleToTeamMember_A_fkey" FOREIGN KEY ("A") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RoleToTeamMember_B_fkey" FOREIGN KEY ("B") REFERENCES "TeamMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sanityId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Content" ("createdAt", "id", "sanityId", "type", "updatedAt", "views") SELECT "createdAt", "id", "sanityId", "type", "updatedAt", "views" FROM "Content";
DROP TABLE "Content";
ALTER TABLE "new_Content" RENAME TO "Content";
CREATE UNIQUE INDEX "Content_sanityId_key" ON "Content"("sanityId");
CREATE UNIQUE INDEX "Content_sanityId_type_key" ON "Content"("sanityId", "type");
CREATE TABLE "new_Enrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT,
    "enrolledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "teamId" TEXT,
    "programId" TEXT,
    "courseId" TEXT,
    CONSTRAINT "Enrollment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("subscriptionId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Enrollment" ("enrolledAt", "id", "subscriptionId", "userId") SELECT "enrolledAt", "id", "subscriptionId", "userId" FROM "Enrollment";
DROP TABLE "Enrollment";
ALTER TABLE "new_Enrollment" RENAME TO "Enrollment";
CREATE INDEX "Enrollment_subscriptionId_idx" ON "Enrollment"("subscriptionId");
CREATE INDEX "Enrollment_teamId_idx" ON "Enrollment"("teamId");
CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON "Enrollment"("userId", "courseId");
CREATE UNIQUE INDEX "Enrollment_userId_programId_key" ON "Enrollment"("userId", "programId");
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    "programId" TEXT,
    "courseId" TEXT,
    CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("authorId", "body", "createdAt", "featured", "id", "rating", "status", "updatedAt") SELECT "authorId", "body", "createdAt", "featured", "id", "rating", "status", "updatedAt" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE INDEX "Review_authorId_idx" ON "Review"("authorId");
CREATE INDEX "Review_courseId_idx" ON "Review"("courseId");
CREATE INDEX "Review_programId_idx" ON "Review"("programId");
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");
CREATE TABLE "new_Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentPeriodEnd" DATETIME NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'BASIC',
    "lastWebhookAt" DATETIME,
    "lastWebhookType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    "teamId" TEXT,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Subscription_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Subscription" ("createdAt", "currentPeriodEnd", "id", "lastWebhookAt", "lastWebhookType", "status", "subscriptionId", "updatedAt", "userId") SELECT "createdAt", "currentPeriodEnd", "id", "lastWebhookAt", "lastWebhookType", "status", "subscriptionId", "updatedAt", "userId" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
CREATE UNIQUE INDEX "Subscription_subscriptionId_key" ON "Subscription"("subscriptionId");
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");
CREATE UNIQUE INDEX "Subscription_teamId_key" ON "Subscription"("teamId");
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX "Subscription_teamId_idx" ON "Subscription"("teamId");
CREATE INDEX "Subscription_currentPeriodEnd_idx" ON "Subscription"("currentPeriodEnd");
CREATE TABLE "new_TimeSpent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "lastActive" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT,
    CONSTRAINT "TimeSpent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TimeSpent_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TimeSpent" ("createdAt", "id", "lastActive", "updatedAt", "userId") SELECT "createdAt", "id", "lastActive", "updatedAt", "userId" FROM "TimeSpent";
DROP TABLE "TimeSpent";
ALTER TABLE "new_TimeSpent" RENAME TO "TimeSpent";
CREATE INDEX "TimeSpent_userId_idx" ON "TimeSpent"("userId");
CREATE INDEX "TimeSpent_lessonId_idx" ON "TimeSpent"("lessonId");
CREATE INDEX "TimeSpent_lastActive_idx" ON "TimeSpent"("lastActive");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isSubscribed" BOOLEAN NOT NULL DEFAULT false,
    "lastSeenAt" DATETIME,
    "timezone" TEXT,
    "preferences" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "isSubscribed", "name", "updatedAt") SELECT "createdAt", "email", "id", "isSubscribed", "name", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "AuditLog_module_idx" ON "AuditLog"("module");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_category_idx" ON "AuditLog"("category");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_teamId_idx" ON "AuditLog"("teamId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_idx" ON "AuditLog"("entityType");

-- CreateIndex
CREATE INDEX "AuditLog_entityId_idx" ON "AuditLog"("entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_module_createdAt_idx" ON "AuditLog"("module", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_teamId_createdAt_idx" ON "AuditLog"("teamId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLogDetail_auditLogId_idx" ON "AuditLogDetail"("auditLogId");

-- CreateIndex
CREATE INDEX "AuditLogDetail_field_idx" ON "AuditLogDetail"("field");

-- CreateIndex
CREATE INDEX "AuditLogExport_teamId_idx" ON "AuditLogExport"("teamId");

-- CreateIndex
CREATE INDEX "AuditLogExport_status_idx" ON "AuditLogExport"("status");

-- CreateIndex
CREATE INDEX "AuditLogExport_requestedById_idx" ON "AuditLogExport"("requestedById");

-- CreateIndex
CREATE INDEX "AuditLogExport_createdAt_idx" ON "AuditLogExport"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyChallenge_month_year_key" ON "MonthlyChallenge"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_slug_key" ON "Challenge"("slug");

-- CreateIndex
CREATE INDEX "Challenge_monthlyChallengeId_idx" ON "Challenge"("monthlyChallengeId");

-- CreateIndex
CREATE INDEX "ChallengeTestCase_challengeId_idx" ON "ChallengeTestCase"("challengeId");

-- CreateIndex
CREATE INDEX "ChallengeSubmission_userId_idx" ON "ChallengeSubmission"("userId");

-- CreateIndex
CREATE INDEX "ChallengeSubmission_challengeId_idx" ON "ChallengeSubmission"("challengeId");

-- CreateIndex
CREATE INDEX "ChallengeSubmission_status_idx" ON "ChallengeSubmission"("status");

-- CreateIndex
CREATE INDEX "UserChallenge_userId_idx" ON "UserChallenge"("userId");

-- CreateIndex
CREATE INDEX "UserChallenge_challengeId_idx" ON "UserChallenge"("challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserChallenge_userId_challengeId_key" ON "UserChallenge"("userId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_name_key" ON "Badge"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserChallengeBadge_submissionId_key" ON "UserChallengeBadge"("submissionId");

-- CreateIndex
CREATE INDEX "UserChallengeBadge_userId_idx" ON "UserChallengeBadge"("userId");

-- CreateIndex
CREATE INDEX "UserChallengeBadge_badgeId_idx" ON "UserChallengeBadge"("badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserChallengeBadge_userId_badgeId_key" ON "UserChallengeBadge"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_scope_language_month_year_key" ON "Leaderboard"("scope", "language", "month", "year");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_leaderboardId_idx" ON "LeaderboardEntry"("leaderboardId");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_userId_idx" ON "LeaderboardEntry"("userId");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_score_idx" ON "LeaderboardEntry"("score");

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_leaderboardId_userId_key" ON "LeaderboardEntry"("leaderboardId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Program_sanityId_key" ON "Program"("sanityId");

-- CreateIndex
CREATE INDEX "Program_userId_idx" ON "Program"("userId");

-- CreateIndex
CREATE INDEX "Program_userId_status_idx" ON "Program"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Course_sanityId_key" ON "Course"("sanityId");

-- CreateIndex
CREATE INDEX "Course_userId_idx" ON "Course"("userId");

-- CreateIndex
CREATE INDEX "Course_programId_idx" ON "Course"("programId");

-- CreateIndex
CREATE INDEX "Course_userId_status_idx" ON "Course"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Module_sanityId_key" ON "Module"("sanityId");

-- CreateIndex
CREATE INDEX "Module_userId_idx" ON "Module"("userId");

-- CreateIndex
CREATE INDEX "Module_courseId_idx" ON "Module"("courseId");

-- CreateIndex
CREATE INDEX "Module_userId_status_idx" ON "Module"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "SubModule_sanityId_key" ON "SubModule"("sanityId");

-- CreateIndex
CREATE INDEX "SubModule_userId_idx" ON "SubModule"("userId");

-- CreateIndex
CREATE INDEX "SubModule_moduleId_idx" ON "SubModule"("moduleId");

-- CreateIndex
CREATE INDEX "SubModule_userId_status_idx" ON "SubModule"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_sanityId_key" ON "Lesson"("sanityId");

-- CreateIndex
CREATE INDEX "Lesson_userId_idx" ON "Lesson"("userId");

-- CreateIndex
CREATE INDEX "Lesson_subModuleId_idx" ON "Lesson"("subModuleId");

-- CreateIndex
CREATE INDEX "Lesson_userId_status_idx" ON "Lesson"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Image_userId_key" ON "Image"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_teamId_key" ON "Image"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_teamCertificateId_key" ON "Image"("teamCertificateId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_teamSettingsId_key" ON "Image"("teamSettingsId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_badgeId_key" ON "Image"("badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_slug_key" ON "Team"("slug");

-- CreateIndex
CREATE INDEX "Team_ownerId_idx" ON "Team"("ownerId");

-- CreateIndex
CREATE INDEX "Team_slug_idx" ON "Team"("slug");

-- CreateIndex
CREATE INDEX "Team_isActive_idx" ON "Team"("isActive");

-- CreateIndex
CREATE INDEX "TeamMember_teamId_idx" ON "TeamMember"("teamId");

-- CreateIndex
CREATE INDEX "TeamMember_userId_idx" ON "TeamMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId");

-- CreateIndex
CREATE INDEX "TeamInvite_teamId_idx" ON "TeamInvite"("teamId");

-- CreateIndex
CREATE INDEX "TeamInvite_email_idx" ON "TeamInvite"("email");

-- CreateIndex
CREATE INDEX "TeamInvite_status_idx" ON "TeamInvite"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TeamInvite_teamId_email_key" ON "TeamInvite"("teamId", "email");

-- CreateIndex
CREATE INDEX "TeamLearningPath_teamId_idx" ON "TeamLearningPath"("teamId");

-- CreateIndex
CREATE INDEX "TeamLearningPath_order_idx" ON "TeamLearningPath"("order");

-- CreateIndex
CREATE INDEX "TeamLearningPathCourse_learningPathId_idx" ON "TeamLearningPathCourse"("learningPathId");

-- CreateIndex
CREATE INDEX "TeamLearningPathCourse_order_idx" ON "TeamLearningPathCourse"("order");

-- CreateIndex
CREATE UNIQUE INDEX "TeamLearningPathCourse_learningPathId_courseId_key" ON "TeamLearningPathCourse"("learningPathId", "courseId");

-- CreateIndex
CREATE INDEX "TeamCertificate_teamId_idx" ON "TeamCertificate"("teamId");

-- CreateIndex
CREATE INDEX "TeamMemberCertificate_teamId_idx" ON "TeamMemberCertificate"("teamId");

-- CreateIndex
CREATE INDEX "TeamMemberCertificate_memberId_idx" ON "TeamMemberCertificate"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMemberCertificate_teamId_memberId_certificateId_key" ON "TeamMemberCertificate"("teamId", "memberId", "certificateId");

-- CreateIndex
CREATE INDEX "TeamAnalytics_teamId_idx" ON "TeamAnalytics"("teamId");

-- CreateIndex
CREATE INDEX "TeamAnalytics_date_idx" ON "TeamAnalytics"("date");

-- CreateIndex
CREATE INDEX "TeamAnalytics_metric_idx" ON "TeamAnalytics"("metric");

-- CreateIndex
CREATE INDEX "TeamMemberAnalytics_memberId_idx" ON "TeamMemberAnalytics"("memberId");

-- CreateIndex
CREATE INDEX "TeamMemberAnalytics_date_idx" ON "TeamMemberAnalytics"("date");

-- CreateIndex
CREATE INDEX "TeamMemberAnalytics_metric_idx" ON "TeamMemberAnalytics"("metric");

-- CreateIndex
CREATE INDEX "TeamIntegration_teamId_idx" ON "TeamIntegration"("teamId");

-- CreateIndex
CREATE INDEX "TeamIntegration_type_idx" ON "TeamIntegration"("type");

-- CreateIndex
CREATE UNIQUE INDEX "TeamSettings_teamId_key" ON "TeamSettings"("teamId");

-- CreateIndex
CREATE INDEX "TeamSettings_teamId_idx" ON "TeamSettings"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToTeamMember_AB_unique" ON "_RoleToTeamMember"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToTeamMember_B_index" ON "_RoleToTeamMember"("B");

-- CreateIndex
CREATE INDEX "Connection_userId_idx" ON "Connection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_providerName_userId_key" ON "Connection"("providerName", "userId");
