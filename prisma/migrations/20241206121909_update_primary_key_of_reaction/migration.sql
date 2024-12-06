/*
  Warnings:

  - The primary key for the `postReactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `groupPostId` on the `postReactions` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `postReactions` table. All the data in the column will be lost.
  - Made the column `postId` on table `postReactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "postReactions" DROP CONSTRAINT "postReactions_groupPostId_fkey";

-- DropForeignKey
ALTER TABLE "postReactions" DROP CONSTRAINT "postReactions_postId_fkey";

-- AlterTable
ALTER TABLE "postReactions" DROP CONSTRAINT "postReactions_pkey",
DROP COLUMN "groupPostId",
DROP COLUMN "id",
ALTER COLUMN "postId" SET NOT NULL,
ADD CONSTRAINT "postReactions_pkey" PRIMARY KEY ("userId", "postId");

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "postReactions" ADD CONSTRAINT "postReactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
