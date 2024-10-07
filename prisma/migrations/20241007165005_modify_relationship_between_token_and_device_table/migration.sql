/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Token_deviceId_key" ON "Token"("deviceId");
