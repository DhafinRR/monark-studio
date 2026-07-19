-- AlterTable
ALTER TABLE "PortfolioProject" ADD COLUMN     "clientName" TEXT,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "fullDescription" TEXT,
ADD COLUMN     "gallery" TEXT[],
ALTER COLUMN "projectUrl" DROP NOT NULL;
