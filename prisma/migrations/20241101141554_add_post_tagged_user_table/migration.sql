-- CreateTable
CREATE TABLE "posttaggedUsers" (
    "postId" TEXT NOT NULL,
    "taggedUserId" TEXT NOT NULL,

    CONSTRAINT "posttaggedUsers_pkey" PRIMARY KEY ("postId","taggedUserId")
);

-- AddForeignKey
ALTER TABLE "posttaggedUsers" ADD CONSTRAINT "posttaggedUsers_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posttaggedUsers" ADD CONSTRAINT "posttaggedUsers_taggedUserId_fkey" FOREIGN KEY ("taggedUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
