-- CreateEnum
CREATE TYPE "EInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- CreateTable
CREATE TABLE "groupInvitations" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "invitedUserId" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "status" "EInvitationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "groupInvitations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "groupInvitations" ADD CONSTRAINT "groupInvitations_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupInvitations" ADD CONSTRAINT "groupInvitations_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupInvitations" ADD CONSTRAINT "groupInvitations_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
