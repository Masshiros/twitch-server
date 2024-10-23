/*
  Warnings:

  - The primary key for the `notificationsUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `notificationsUser` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverId` to the `notificationsUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notificationsUser" DROP CONSTRAINT "notificationsUser_userId_fkey";

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "senderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notificationsUser" DROP CONSTRAINT "notificationsUser_pkey",
DROP COLUMN "userId",
ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD CONSTRAINT "notificationsUser_pkey" PRIMARY KEY ("receiverId", "notificationId");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificationsUser" ADD CONSTRAINT "notificationsUser_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
