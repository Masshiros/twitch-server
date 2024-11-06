/*
  Warnings:

  - You are about to drop the column `avatarId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_avatarId_fkey";

-- DropIndex
DROP INDEX "users_avatarId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatarId";
