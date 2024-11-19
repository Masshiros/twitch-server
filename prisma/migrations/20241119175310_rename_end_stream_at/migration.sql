/*
  Warnings:

  - You are about to drop the column `endSteamAt` on the `Livestream` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Livestream" DROP COLUMN "endSteamAt",
ADD COLUMN     "endStreamAt" TIMESTAMP(3);
