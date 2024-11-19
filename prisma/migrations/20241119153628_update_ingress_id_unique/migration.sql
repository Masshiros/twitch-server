/*
  Warnings:

  - A unique constraint covering the columns `[ingressId]` on the table `Livestream` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Livestream_ingressId_key" ON "Livestream"("ingressId");
