/*
  Warnings:

  - You are about to drop the column `applicableId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `categories` table. All the data in the column will be lost.
  - The primary key for the `userCategories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `userCategories` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ETag" AS ENUM ('CATEGORY', 'LIVESTREAM');

-- DropIndex
DROP INDEX "userCategories_userId_categoryId_key";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "applicableId",
DROP COLUMN "tagId",
DROP COLUMN "userId",
ADD COLUMN     "numberOfFollowers" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "userCategories" DROP CONSTRAINT "userCategories_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "userCategories_pkey" PRIMARY KEY ("userId", "categoryId");

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "applicableTo" "ETag" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tagCategories" (
    "tagId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "tagCategories_pkey" PRIMARY KEY ("tagId","categoryId")
);

-- CreateTable
CREATE TABLE "categoryFollowers" (
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categoryFollowers_pkey" PRIMARY KEY ("userId","categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- AddForeignKey
ALTER TABLE "tagCategories" ADD CONSTRAINT "tagCategories_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tagCategories" ADD CONSTRAINT "tagCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoryFollowers" ADD CONSTRAINT "categoryFollowers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoryFollowers" ADD CONSTRAINT "categoryFollowers_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
