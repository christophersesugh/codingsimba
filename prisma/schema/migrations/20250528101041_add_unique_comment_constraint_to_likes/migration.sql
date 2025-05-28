/*
  Warnings:

  - A unique constraint covering the columns `[contentId,userId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[commentId,userId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Like_userId_contentId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Like_contentId_userId_key" ON "Like"("contentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_commentId_userId_key" ON "Like"("commentId", "userId");
