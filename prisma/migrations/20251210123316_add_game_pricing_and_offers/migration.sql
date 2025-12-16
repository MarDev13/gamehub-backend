/*
  Warnings:

  - Added the required column `price` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('ACTIVE', 'HIDDEN', 'OUT_OF_STOCK');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "discountPct" INTEGER,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "onSale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "saleEndDate" TIMESTAMP(3),
ADD COLUMN     "salePrice" DOUBLE PRECISION,
ADD COLUMN     "saleStartDate" TIMESTAMP(3),
ADD COLUMN     "status" "GameStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;
