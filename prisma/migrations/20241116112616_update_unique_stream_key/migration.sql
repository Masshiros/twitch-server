/*
  Warnings:

  - A unique constraint covering the columns `[serverUrl]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[streamKey]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_serverUrl_key" ON "users"("serverUrl");

-- CreateIndex
CREATE UNIQUE INDEX "users_streamKey_key" ON "users"("streamKey");
