-- CreateTable
CREATE TABLE "hidden_users" (
    "userId" TEXT NOT NULL,
    "hiddenUserId" TEXT NOT NULL,

    CONSTRAINT "hidden_users_pkey" PRIMARY KEY ("userId","hiddenUserId")
);

-- AddForeignKey
ALTER TABLE "hidden_users" ADD CONSTRAINT "hidden_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hidden_users" ADD CONSTRAINT "hidden_users_hiddenUserId_fkey" FOREIGN KEY ("hiddenUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
