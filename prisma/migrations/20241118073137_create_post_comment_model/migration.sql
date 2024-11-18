-- CreateTable
CREATE TABLE "postComments" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "postComments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "postComments_postId_idx" ON "postComments"("postId");

-- CreateIndex
CREATE INDEX "postComments_userId_idx" ON "postComments"("userId");

-- AddForeignKey
ALTER TABLE "postComments" ADD CONSTRAINT "postComments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postComments" ADD CONSTRAINT "postComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postComments" ADD CONSTRAINT "postComments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "postComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
