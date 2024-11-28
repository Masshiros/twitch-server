/*
  Warnings:

  - You are about to drop the column `isLive` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_isLive_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isLive";
