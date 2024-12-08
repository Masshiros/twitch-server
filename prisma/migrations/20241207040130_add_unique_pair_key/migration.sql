/*
  Warnings:

  - A unique constraint covering the columns `[creatorId,receiverId]` on the table `conversations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "conversations_creatorId_receiverId_key" ON "conversations"("creatorId", "receiverId");
