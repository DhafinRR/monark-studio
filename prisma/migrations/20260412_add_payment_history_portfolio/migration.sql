-- Create Payment table
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "amount" DECIMAL(12, 2) NOT NULL,
    "payment_method" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- Create index for order_id
CREATE INDEX "payment_order_id_idx" ON "payment"("order_id");

-- Add constraint for status
ALTER TABLE "payment" ADD CONSTRAINT "payment_status_check" CHECK ("status" IN ('PENDING', 'CONFIRMED', 'CANCELLED'));

-- Add history column to order (JSON for flexibility)
ALTER TABLE "order" ADD COLUMN "history" JSONB;

-- Add portfolio relation columns
ALTER TABLE "order" ADD COLUMN "portfolio_id" TEXT;
ALTER TABLE "portfolio_project" ADD COLUMN "order_id" TEXT;

-- Add foreign key for portfolio relation
ALTER TABLE "order" ADD CONSTRAINT "order_portfolio_fkey" 
    FOREIGN KEY ("portfolio_id") REFERENCES "portfolio_project"("id") ON DELETE SET NULL;

ALTER TABLE "portfolio_project" ADD CONSTRAINT "portfolio_project_order_id_key" UNIQUE ("order_id");

ALTER TABLE "portfolio_project" ADD CONSTRAINT "portfolio_project_order_fkey" 
    FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE SET NULL;

-- Add foreign key for payment -> order
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_fkey" 
    FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
