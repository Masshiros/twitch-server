-- DropForeignKey
ALTER TABLE "liveStreamInfos" DROP CONSTRAINT "liveStreamInfos_userId_fkey";

-- AddForeignKey
ALTER TABLE "liveStreamInfos" ADD CONSTRAINT "liveStreamInfos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
