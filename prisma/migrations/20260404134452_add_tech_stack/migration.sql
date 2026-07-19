/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortfolioProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Testimonial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ComplexityLevel" AS ENUM ('MUDAH', 'SEDANG', 'SULIT', 'SANGAT_SULIT');

-- CreateEnum
CREATE TYPE "ComplexitySubLevel" AS ENUM ('MINOR', 'MAJOR');

-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('FEATURE', 'TASK');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('CATALOG', 'CUSTOM');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'PENDING', 'ACTIVE', 'ON_PROGRESS', 'DONE', 'CANCELLED');

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "PortfolioProject";

-- DropTable
DROP TABLE "Service";

-- DropTable
DROP TABLE "Testimonial";

-- DropTable
DROP TABLE "WebSettings";

-- CreateTable
CREATE TABLE "complexity_price" (
    "level" "ComplexityLevel" NOT NULL,
    "sub_level" "ComplexitySubLevel" NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "complexity_price_pkey" PRIMARY KEY ("level","sub_level")
);

-- CreateTable
CREATE TABLE "feature_catalog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feature_catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "id" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unpaid',
    "payment_url" TEXT,
    "external_id" TEXT,
    "payment_method" TEXT,
    "order_id" TEXT NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "queue_number" INTEGER,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "whatsapp" TEXT NOT NULL,
    "story" TEXT,
    "package_type" TEXT NOT NULL,
    "details" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'DRAFT',
    "total_price" DECIMAL(12,2),
    "asset_link" TEXT,
    "preview_link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "type" "ItemType" NOT NULL DEFAULT 'CATALOG',
    "description" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "level" "ComplexityLevel",
    "sub_level" "ComplexitySubLevel",
    "reason" TEXT,
    "feature_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "full_description" TEXT,
    "type" "ProjectType" NOT NULL DEFAULT 'WEB',
    "image_url" TEXT NOT NULL,
    "gallery" TEXT[],
    "features" TEXT[],
    "client_name" TEXT,
    "project_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon_key" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "web_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "config" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "web_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tech_stack" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon_url" TEXT,
    "color_hex" TEXT DEFAULT '#3b82f6',

    CONSTRAINT "tech_stack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PortfolioProjectToTechStack" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "invoice_invoice_number_key" ON "invoice"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_external_id_key" ON "invoice"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_order_id_key" ON "invoice"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "tech_stack_name_key" ON "tech_stack"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_PortfolioProjectToTechStack_AB_unique" ON "_PortfolioProjectToTechStack"("A", "B");

-- CreateIndex
CREATE INDEX "_PortfolioProjectToTechStack_B_index" ON "_PortfolioProjectToTechStack"("B");

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PortfolioProjectToTechStack" ADD CONSTRAINT "_PortfolioProjectToTechStack_A_fkey" FOREIGN KEY ("A") REFERENCES "portfolio_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PortfolioProjectToTechStack" ADD CONSTRAINT "_PortfolioProjectToTechStack_B_fkey" FOREIGN KEY ("B") REFERENCES "tech_stack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
