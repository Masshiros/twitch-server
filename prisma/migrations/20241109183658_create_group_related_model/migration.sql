/*
  Warnings:

  - The primary key for the `groupMembers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `groupMembers` table. All the data in the column will be lost.
  - The primary key for the `postReactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `memberId` to the `groupMembers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `privacy` to the `groups` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `postReactions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "EGroupPrivacy" AS ENUM ('VISIBLE', 'HIDDEN');

-- CreateEnum
CREATE TYPE "EGroupRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');

-- CreateEnum
CREATE TYPE "EGroupPostStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');

-- DropForeignKey
ALTER TABLE "groupMembers" DROP CONSTRAINT "groupMembers_userId_fkey";

-- DropForeignKey
ALTER TABLE "postReactions" DROP CONSTRAINT "postReactions_postId_fkey";

-- DropForeignKey
ALTER TABLE "postReactions" DROP CONSTRAINT "postReactions_userId_fkey";

-- AlterTable
ALTER TABLE "groupMembers" DROP CONSTRAINT "groupMembers_pkey",
DROP COLUMN "userId",
ADD COLUMN     "memberId" TEXT NOT NULL,
ADD CONSTRAINT "groupMembers_pkey" PRIMARY KEY ("groupId", "memberId");

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "privacy" "EGroupPrivacy" NOT NULL;

-- AlterTable
ALTER TABLE "postReactions" DROP CONSTRAINT "postReactions_pkey",
ADD COLUMN     "groupPostId" TEXT,
ADD COLUMN     "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "postId" DROP NOT NULL,
ADD CONSTRAINT "postReactions_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "groupInviteLinks" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "maxUses" INTEGER NOT NULL,
    "currentUses" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groupInviteLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberRequests" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "EGroupRequestStatus" NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "comment" TEXT,

    CONSTRAINT "memberRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groupRules" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "groupRules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groupPosts" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "EGroupPostStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "groupPosts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "groupInviteLinks_link_key" ON "groupInviteLinks"("link");

-- AddForeignKey
ALTER TABLE "postReactions" ADD CONSTRAINT "postReactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postReactions" ADD CONSTRAINT "postReactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postReactions" ADD CONSTRAINT "postReactions_groupPostId_fkey" FOREIGN KEY ("groupPostId") REFERENCES "groupPosts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupInviteLinks" ADD CONSTRAINT "groupInviteLinks_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberRequests" ADD CONSTRAINT "memberRequests_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberRequests" ADD CONSTRAINT "memberRequests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupMembers" ADD CONSTRAINT "groupMembers_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupRules" ADD CONSTRAINT "groupRules_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupPosts" ADD CONSTRAINT "groupPosts_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupPosts" ADD CONSTRAINT "groupPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
