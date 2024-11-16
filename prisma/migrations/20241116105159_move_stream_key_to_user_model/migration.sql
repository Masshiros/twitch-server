/*
  Warnings:

  - You are about to drop the column `serverUrl` on the `Livestream` table. All the data in the column will be lost.
  - You are about to drop the column `streamKey` on the `Livestream` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Livestream" DROP COLUMN "serverUrl",
DROP COLUMN "streamKey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "serverUrl" TEXT,
ADD COLUMN     "streamKey" TEXT;
