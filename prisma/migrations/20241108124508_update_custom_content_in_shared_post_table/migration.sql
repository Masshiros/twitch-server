/*
  Warnings:

  - Added the required column `customContent` to the `sharedPosts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sharedPosts" ADD COLUMN     "customContent" TEXT NOT NULL;
