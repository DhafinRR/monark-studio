-- AlterTable
ALTER TABLE "portfolio_project" ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "role" TEXT,
ADD COLUMN     "start_date" TIMESTAMP(3),
ADD COLUMN     "status" TEXT DEFAULT 'Live';
