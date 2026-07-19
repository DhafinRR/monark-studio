-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('WEB', 'ANDROID', 'IOS', 'BOTH');

-- AlterTable
ALTER TABLE "order" ADD COLUMN "platform" "Platform";
