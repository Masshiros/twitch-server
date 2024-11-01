/*
  Warnings:

  - You are about to drop the column `createdAt` on the `postReactions` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `postReactions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `postReactions` table. All the data in the column will be lost.
  - You are about to drop the `groupPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userPosts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "groupPosts" DROP CONSTRAINT "groupPosts_groupId_fkey";

-- DropForeignKey
ALTER TABLE "groupPosts" DROP CONSTRAINT "groupPosts_userId_fkey";

-- DropForeignKey
ALTER TABLE "postReactions" DROP CONSTRAINT "postReactions_postId_fkey";

-- DropForeignKey
ALTER TABLE "userPostViewPermissions" DROP CONSTRAINT "userPostViewPermissions_postId_fkey";

-- DropForeignKey
ALTER TABLE "userPosts" DROP CONSTRAINT "userPosts_userId_fkey";

-- AlterTable
ALTER TABLE "postReactions" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "groupPosts";

-- DropTable
DROP TABLE "userPosts";

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT,
    "content" TEXT NOT NULL,
    "totalViewCount" INTEGER NOT NULL DEFAULT 0,
    "visibility" "EUserPostVisibility" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPostViewPermissions" ADD CONSTRAINT "userPostViewPermissions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postReactions" ADD CONSTRAINT "postReactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
