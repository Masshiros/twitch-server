/*
  Warnings:

  - You are about to drop the `SharedPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SharedPost" DROP CONSTRAINT "SharedPost_postId_fkey";

-- DropTable
DROP TABLE "SharedPost";

-- CreateTable
CREATE TABLE "sharedPosts" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "sharedById" TEXT NOT NULL,
    "sharedToId" TEXT NOT NULL,
    "sharedToType" "ESharedType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sharedPosts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sharedPosts" ADD CONSTRAINT "sharedPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
