-- CreateTable
CREATE TABLE "groupPostTaggedUsers" (
    "postId" TEXT NOT NULL,
    "taggedUserId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "groupPostTaggedUsers_pkey" PRIMARY KEY ("postId","taggedUserId")
);

-- AddForeignKey
ALTER TABLE "groupPostTaggedUsers" ADD CONSTRAINT "groupPostTaggedUsers_postId_fkey" FOREIGN KEY ("postId") REFERENCES "groupPosts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupPostTaggedUsers" ADD CONSTRAINT "groupPostTaggedUsers_taggedUserId_fkey" FOREIGN KEY ("taggedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupPostTaggedUsers" ADD CONSTRAINT "groupPostTaggedUsers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
