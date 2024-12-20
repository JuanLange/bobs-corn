-- CreateTable
CREATE TABLE "corn_purchases" (
    "id" SERIAL PRIMARY KEY,
    "client_ip" TEXT NOT NULL,
    "purchase_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "corn_purchases_client_ip_idx" ON "corn_purchases"("client_ip");

-- CreateIndex
CREATE INDEX "corn_purchases_purchase_time_idx" ON "corn_purchases"("purchase_time");
