/*
  Warnings:

  - You are about to drop the column `tagByGroupId` on the `groupPosts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "groupPosts" DROP COLUMN "tagByGroupId",
ADD COLUMN     "tagByGroupPostId" TEXT;
