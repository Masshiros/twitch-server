/*
  Warnings:

  - The primary key for the `followers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `followerId` on the `followers` table. All the data in the column will be lost.
  - You are about to drop the column `followingId` on the `followers` table. All the data in the column will be lost.
  - Added the required column `destinationUserId` to the `followers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceUserId` to the `followers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "followers" DROP CONSTRAINT "followers_followerId_fkey";

-- DropForeignKey
ALTER TABLE "followers" DROP CONSTRAINT "followers_followingId_fkey";

-- AlterTable
ALTER TABLE "followers" DROP CONSTRAINT "followers_pkey",
DROP COLUMN "followerId",
DROP COLUMN "followingId",
ADD COLUMN     "destinationUserId" TEXT NOT NULL,
ADD COLUMN     "sourceUserId" TEXT NOT NULL,
ADD CONSTRAINT "followers_pkey" PRIMARY KEY ("sourceUserId", "destinationUserId");

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_sourceUserId_fkey" FOREIGN KEY ("sourceUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_destinationUserId_fkey" FOREIGN KEY ("destinationUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
