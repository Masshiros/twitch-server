/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Livestream` table. All the data in the column will be lost.
  - You are about to drop the column `isLive` on the `Livestream` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `Livestream` table. All the data in the column will be lost.
  - You are about to drop the column `tagName` on the `Livestream` table. All the data in the column will be lost.
  - You are about to drop the column `tagSlug` on the `Livestream` table. All the data in the column will be lost.
  - You are about to drop the column `themeColor` on the `Livestream` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailPreviewImage` on the `Livestream` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Livestream` table. All the data in the column will be lost.
  - You are about to drop the column `userImage` on the `Livestream` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Livestream` table. All the data in the column will be lost.
  - You are about to drop the column `userSlug` on the `Livestream` table. All the data in the column will be lost.
  - You are about to drop the `userCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Livestream" DROP CONSTRAINT "Livestream_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Livestream" DROP CONSTRAINT "Livestream_tagId_fkey";

-- DropForeignKey
ALTER TABLE "userCategories" DROP CONSTRAINT "userCategories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "userCategories" DROP CONSTRAINT "userCategories_userId_fkey";

-- DropIndex
DROP INDEX "Livestream_categoryId_idx";

-- DropIndex
DROP INDEX "Livestream_tagId_idx";

-- AlterTable
ALTER TABLE "Livestream" DROP COLUMN "categoryId",
DROP COLUMN "isLive",
DROP COLUMN "tagId",
DROP COLUMN "tagName",
DROP COLUMN "tagSlug",
DROP COLUMN "themeColor",
DROP COLUMN "thumbnailPreviewImage",
DROP COLUMN "title",
DROP COLUMN "userImage",
DROP COLUMN "userName",
DROP COLUMN "userSlug";

-- DropTable
DROP TABLE "userCategories";

-- CreateTable
CREATE TABLE "LiveStreamInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT,
    "userImage" TEXT,
    "userSlug" TEXT,
    "title" TEXT,
    "isLive" BOOLEAN,
    "thumbnailPreviewImage" TEXT,
    "themeColor" TEXT,

    CONSTRAINT "LiveStreamInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveStreamTagsInfo" (
    "liveStreamInfoId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "LiveStreamTagsInfo_pkey" PRIMARY KEY ("liveStreamInfoId","tagId")
);

-- CreateTable
CREATE TABLE "LiveStreamCategoriesInfo" (
    "liveStreamInfoId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "LiveStreamCategoriesInfo_pkey" PRIMARY KEY ("liveStreamInfoId","categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "LiveStreamInfo_userId_key" ON "LiveStreamInfo"("userId");

-- AddForeignKey
ALTER TABLE "LiveStreamInfo" ADD CONSTRAINT "LiveStreamInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveStreamTagsInfo" ADD CONSTRAINT "LiveStreamTagsInfo_liveStreamInfoId_fkey" FOREIGN KEY ("liveStreamInfoId") REFERENCES "LiveStreamInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveStreamTagsInfo" ADD CONSTRAINT "LiveStreamTagsInfo_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveStreamCategoriesInfo" ADD CONSTRAINT "LiveStreamCategoriesInfo_liveStreamInfoId_fkey" FOREIGN KEY ("liveStreamInfoId") REFERENCES "LiveStreamInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveStreamCategoriesInfo" ADD CONSTRAINT "LiveStreamCategoriesInfo_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
