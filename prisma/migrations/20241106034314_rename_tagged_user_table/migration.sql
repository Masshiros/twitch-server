/*
  Warnings:

  - You are about to drop the `posttaggedUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "posttaggedUsers" DROP CONSTRAINT "posttaggedUsers_postId_fkey";

-- DropForeignKey
ALTER TABLE "posttaggedUsers" DROP CONSTRAINT "posttaggedUsers_taggedUserId_fkey";

-- DropTable
DROP TABLE "posttaggedUsers";

-- CreateTable
CREATE TABLE "postTaggedUsers" (
    "postId" TEXT NOT NULL,
    "taggedUserId" TEXT NOT NULL,

    CONSTRAINT "postTaggedUsers_pkey" PRIMARY KEY ("postId","taggedUserId")
);

-- AddForeignKey
ALTER TABLE "postTaggedUsers" ADD CONSTRAINT "postTaggedUsers_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postTaggedUsers" ADD CONSTRAINT "postTaggedUsers_taggedUserId_fkey" FOREIGN KEY ("taggedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
