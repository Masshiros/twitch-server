/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `LoginHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userAgent]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ipAddress` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAgent` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "ipAddress" TEXT NOT NULL,
ADD COLUMN     "userAgent" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LoginHistory" DROP COLUMN "ipAddress";

-- CreateIndex
CREATE UNIQUE INDEX "Device_userAgent_key" ON "Device"("userAgent");
