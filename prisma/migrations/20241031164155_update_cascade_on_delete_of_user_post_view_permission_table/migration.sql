-- DropForeignKey
ALTER TABLE "userPostViewPermissions" DROP CONSTRAINT "userPostViewPermissions_postId_fkey";

-- DropForeignKey
ALTER TABLE "userPostViewPermissions" DROP CONSTRAINT "userPostViewPermissions_viewerId_fkey";

-- AddForeignKey
ALTER TABLE "userPostViewPermissions" ADD CONSTRAINT "userPostViewPermissions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPostViewPermissions" ADD CONSTRAINT "userPostViewPermissions_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
