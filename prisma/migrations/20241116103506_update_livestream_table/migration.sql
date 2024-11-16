-- CreateTable
CREATE TABLE "Livestream" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "tagId" TEXT,
    "tagName" TEXT,
    "tagSlug" TEXT,
    "userName" TEXT,
    "userImage" TEXT,
    "userSlug" TEXT,
    "title" TEXT,
    "slug" TEXT,
    "totalView" INTEGER,
    "isLive" BOOLEAN,
    "isChatEnabled" BOOLEAN,
    "isChatDelayed" BOOLEAN,
    "delayedSeconds" TEXT,
    "isChatFollowersOnly" BOOLEAN,
    "thumbnailPreviewImage" TEXT,
    "themeColor" TEXT,
    "serverUrl" TEXT NOT NULL,
    "streamKey" TEXT NOT NULL,

    CONSTRAINT "Livestream_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Livestream_userId_idx" ON "Livestream"("userId");

-- CreateIndex
CREATE INDEX "Livestream_categoryId_idx" ON "Livestream"("categoryId");

-- CreateIndex
CREATE INDEX "Livestream_tagId_idx" ON "Livestream"("tagId");

-- AddForeignKey
ALTER TABLE "Livestream" ADD CONSTRAINT "Livestream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livestream" ADD CONSTRAINT "Livestream_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livestream" ADD CONSTRAINT "Livestream_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
