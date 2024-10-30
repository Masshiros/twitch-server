-- CreateEnum
CREATE TYPE "EGroupVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'HIDDEN');

-- CreateEnum
CREATE TYPE "EGroupRole" AS ENUM ('MEMBER', 'ADMIN');

-- CreateEnum
CREATE TYPE "EUserPostVisibility" AS ENUM ('PUBLIC', 'FRIENDS_ONLY', 'SPECIFIC', 'ONLY_ME');

-- CreateEnum
CREATE TYPE "EReactionType" AS ENUM ('LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY');

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "visibility" "EGroupVisibility" NOT NULL,
    "joinLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groupMembers" (
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "EGroupRole" NOT NULL,

    CONSTRAINT "groupMembers_pkey" PRIMARY KEY ("groupId","userId")
);

-- CreateTable
CREATE TABLE "userPosts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "totalViewCount" INTEGER NOT NULL DEFAULT 0,
    "visibility" "EUserPostVisibility" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userPosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userPostViewPermissions" (
    "postId" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,

    CONSTRAINT "userPostViewPermissions_pkey" PRIMARY KEY ("postId","viewerId")
);

-- CreateTable
CREATE TABLE "groupPosts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "totalViewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groupPosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postReactions" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "type" "EReactionType" NOT NULL,

    CONSTRAINT "postReactions_pkey" PRIMARY KEY ("userId","postId")
);

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupMembers" ADD CONSTRAINT "groupMembers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupMembers" ADD CONSTRAINT "groupMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPosts" ADD CONSTRAINT "userPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPostViewPermissions" ADD CONSTRAINT "userPostViewPermissions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "userPosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPostViewPermissions" ADD CONSTRAINT "userPostViewPermissions_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupPosts" ADD CONSTRAINT "groupPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupPosts" ADD CONSTRAINT "groupPosts_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postReactions" ADD CONSTRAINT "postReactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postReactions" ADD CONSTRAINT "postReactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "userPosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
