/*
  Warnings:

  - You are about to drop the `LiveStreamCategoriesInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LiveStreamInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LiveStreamTagsInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Livestream` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduledPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LiveStreamCategoriesInfo" DROP CONSTRAINT "LiveStreamCategoriesInfo_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "LiveStreamCategoriesInfo" DROP CONSTRAINT "LiveStreamCategoriesInfo_liveStreamInfoId_fkey";

-- DropForeignKey
ALTER TABLE "LiveStreamInfo" DROP CONSTRAINT "LiveStreamInfo_userId_fkey";

-- DropForeignKey
ALTER TABLE "LiveStreamTagsInfo" DROP CONSTRAINT "LiveStreamTagsInfo_liveStreamInfoId_fkey";

-- DropForeignKey
ALTER TABLE "LiveStreamTagsInfo" DROP CONSTRAINT "LiveStreamTagsInfo_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Livestream" DROP CONSTRAINT "Livestream_userId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduledPost" DROP CONSTRAINT "ScheduledPost_groupId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduledPost" DROP CONSTRAINT "ScheduledPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduledPost" DROP CONSTRAINT "ScheduledPost_userId_fkey";

-- DropTable
DROP TABLE "LiveStreamCategoriesInfo";

-- DropTable
DROP TABLE "LiveStreamInfo";

-- DropTable
DROP TABLE "LiveStreamTagsInfo";

-- DropTable
DROP TABLE "Livestream";

-- DropTable
DROP TABLE "ScheduledPost";

-- CreateTable
CREATE TABLE "liveStreamInfos" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT,
    "userImage" TEXT,
    "userSlug" TEXT,
    "title" TEXT,
    "isLive" BOOLEAN,
    "thumbnailPreviewImage" TEXT,
    "themeColor" TEXT,

    CONSTRAINT "liveStreamInfos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "liveStreamTagsInfos" (
    "liveStreamInfoId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "liveStreamTagsInfos_pkey" PRIMARY KEY ("liveStreamInfoId","tagId")
);

-- CreateTable
CREATE TABLE "liveStreamCategoriesInfos" (
    "liveStreamInfoId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "liveStreamCategoriesInfos_pkey" PRIMARY KEY ("liveStreamInfoId","categoryId")
);

-- CreateTable
CREATE TABLE "livestreams" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT,
    "totalView" INTEGER,
    "isChatEnabled" BOOLEAN,
    "isChatDelayed" BOOLEAN,
    "delayedSeconds" TEXT,
    "isChatFollowersOnly" BOOLEAN,
    "ingressId" TEXT,
    "startStreamAt" TIMESTAMP(3),
    "endStreamAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "livestreams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduledPosts" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduledPosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduledGroupPosts" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduledGroupPosts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "liveStreamInfos_userId_key" ON "liveStreamInfos"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "livestreams_ingressId_key" ON "livestreams"("ingressId");

-- CreateIndex
CREATE INDEX "livestreams_userId_idx" ON "livestreams"("userId");

-- AddForeignKey
ALTER TABLE "liveStreamInfos" ADD CONSTRAINT "liveStreamInfos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liveStreamTagsInfos" ADD CONSTRAINT "liveStreamTagsInfos_liveStreamInfoId_fkey" FOREIGN KEY ("liveStreamInfoId") REFERENCES "liveStreamInfos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liveStreamTagsInfos" ADD CONSTRAINT "liveStreamTagsInfos_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liveStreamCategoriesInfos" ADD CONSTRAINT "liveStreamCategoriesInfos_liveStreamInfoId_fkey" FOREIGN KEY ("liveStreamInfoId") REFERENCES "liveStreamInfos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liveStreamCategoriesInfos" ADD CONSTRAINT "liveStreamCategoriesInfos_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livestreams" ADD CONSTRAINT "livestreams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduledPosts" ADD CONSTRAINT "scheduledPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduledPosts" ADD CONSTRAINT "scheduledPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduledGroupPosts" ADD CONSTRAINT "scheduledGroupPosts_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduledGroupPosts" ADD CONSTRAINT "scheduledGroupPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduledGroupPosts" ADD CONSTRAINT "scheduledGroupPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "groupPosts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
