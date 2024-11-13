-- CreateEnum
CREATE TYPE "EImageType" AS ENUM ('THUMBNAIL', 'AVATAR');

-- AlterTable
ALTER TABLE "images" ADD COLUMN     "imageType" "EImageType";
