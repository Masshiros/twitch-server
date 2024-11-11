/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `groupInvitations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "groupInvitations" DROP COLUMN "expiresAt",
ADD COLUMN     "expiredAt" TIMESTAMP(3);
