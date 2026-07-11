/*
  Warnings:

  - You are about to drop the column `package_type` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `portfolio_id` on the `order` table. All the data in the column will be lost.
  - The `status` column on the `payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `feature_catalog` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[duitku_reference]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[merchant_order_id]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `web_settings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `web_settings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderItemClassification" AS ENUM ('STANDARD', 'ADDON');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_portfolio_fkey";

-- DropForeignKey
ALTER TABLE "portfolio_project" DROP CONSTRAINT "portfolio_project_order_fkey";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "package_type",
DROP COLUMN "portfolio_id",
ADD COLUMN     "package_id" TEXT,
ADD COLUMN     "package_snapshot" JSONB,
ADD COLUMN     "project_title" TEXT,
ALTER COLUMN "history" SET DEFAULT '[]';

-- AlterTable
ALTER TABLE "order_item" ADD COLUMN     "classification" "OrderItemClassification" NOT NULL DEFAULT 'STANDARD',
ADD COLUMN     "custom_note" TEXT;

-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "duitku_expiry" TIMESTAMP(3),
ADD COLUMN     "duitku_payment_code" TEXT,
ADD COLUMN     "duitku_payment_url" TEXT,
ADD COLUMN     "duitku_reference" TEXT,
ADD COLUMN     "duitku_va_number" TEXT,
ADD COLUMN     "label" TEXT,
ADD COLUMN     "merchant_order_id" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
CREATE SEQUENCE web_settings_id_seq;
ALTER TABLE "web_settings" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('web_settings_id_seq');
ALTER SEQUENCE web_settings_id_seq OWNED BY "web_settings"."id";

-- CreateTable
CREATE TABLE "about_contents" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL DEFAULT 'About Us',
    "subtitle" VARCHAR(200),
    "content" TEXT NOT NULL,
    "logo_url" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_quotes" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "author" VARCHAR(100),
    "position" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ketentuans" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "order_number" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "icon" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ketentuans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_timelines" (
    "id" TEXT NOT NULL,
    "step_number" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "duration" VARCHAR(50),
    "icon" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "target" TEXT,
    "price_note" TEXT,
    "floor_price" DECIMAL(12,2) NOT NULL,
    "max_slots" INTEGER NOT NULL,
    "benefits" TEXT[],
    "default_features" TEXT[],
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_package_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ketentuans_order_number_key" ON "ketentuans"("order_number");

-- CreateIndex
CREATE UNIQUE INDEX "order_timelines_step_number_key" ON "order_timelines"("step_number");

-- CreateIndex
CREATE UNIQUE INDEX "feature_catalog_name_key" ON "feature_catalog"("name");

-- CreateIndex
CREATE UNIQUE INDEX "payment_duitku_reference_key" ON "payment"("duitku_reference");

-- CreateIndex
CREATE UNIQUE INDEX "payment_merchant_order_id_key" ON "payment"("merchant_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "web_settings_name_key" ON "web_settings"("name");

-- RenameForeignKey
ALTER TABLE "payment" RENAME CONSTRAINT "payment_order_fkey" TO "payment_order_id_fkey";

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "pricing_package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_project" ADD CONSTRAINT "portfolio_project_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
