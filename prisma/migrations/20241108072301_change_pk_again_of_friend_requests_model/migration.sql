/*
  Warnings:

  - The primary key for the `friendRequests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `friendRequests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "friendRequests" DROP CONSTRAINT "friendRequests_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "friendRequests_pkey" PRIMARY KEY ("senderId", "receiverId");
