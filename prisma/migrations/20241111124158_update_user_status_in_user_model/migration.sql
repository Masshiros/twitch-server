-- CreateEnum
CREATE TYPE "EUserStatus" AS ENUM ('VERIFIED', 'UNVERIFIED', 'BANNED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "EUserStatus" NOT NULL DEFAULT 'UNVERIFIED';
