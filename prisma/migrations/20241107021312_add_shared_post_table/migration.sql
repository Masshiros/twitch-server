-- CreateEnum
CREATE TYPE "ESharedType" AS ENUM ('USER', 'CHAT', 'GROUP');

-- CreateTable
CREATE TABLE "SharedPost" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "sharedById" TEXT NOT NULL,
    "sharedToId" TEXT NOT NULL,
    "sharedToType" "ESharedType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SharedPost" ADD CONSTRAINT "SharedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
