-- CreateTable
CREATE TABLE "groupPostComments" (
    "id" TEXT NOT NULL,
    "groupPostId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "parentId" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "groupPostComments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "groupPostComments_groupPostId_idx" ON "groupPostComments"("groupPostId");

-- CreateIndex
CREATE INDEX "groupPostComments_userId_idx" ON "groupPostComments"("userId");

-- AddForeignKey
ALTER TABLE "groupPostComments" ADD CONSTRAINT "groupPostComments_groupPostId_fkey" FOREIGN KEY ("groupPostId") REFERENCES "groupPosts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupPostComments" ADD CONSTRAINT "groupPostComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupPostComments" ADD CONSTRAINT "groupPostComments_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupPostComments" ADD CONSTRAINT "groupPostComments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "groupPostComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
