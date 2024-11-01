-- DropForeignKey
ALTER TABLE "postReactions" DROP CONSTRAINT "postReactions_postId_fkey";

-- DropForeignKey
ALTER TABLE "postReactions" DROP CONSTRAINT "postReactions_userId_fkey";

-- AddForeignKey
ALTER TABLE "postReactions" ADD CONSTRAINT "postReactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postReactions" ADD CONSTRAINT "postReactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
