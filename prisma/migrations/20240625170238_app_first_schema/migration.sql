-- CreateEnum
CREATE TYPE "FUEL_TYPE" AS ENUM ('GASOLINE', 'ETHANOL', 'DIESEL', 'NATURAL_GAS', 'LIQUEFIED_PETROLEUM_GAS');

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "fuel_type" "FUEL_TYPE" NOT NULL DEFAULT 'GASOLINE',
    "doors" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "created_at_millis" BIGINT NOT NULL DEFAULT EXTRACT(epoch FROM NOW()) * 1000
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fipe" DOUBLE PRECISION NOT NULL,
    "brand_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Car_id_key" ON "Car"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Model_id_key" ON "Model"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_id_key" ON "Brand"("id");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
