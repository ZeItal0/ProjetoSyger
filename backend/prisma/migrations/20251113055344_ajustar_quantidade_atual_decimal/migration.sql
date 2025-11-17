/*
  Warnings:

  - You are about to alter the column `quantidade_atual` on the `Produtos` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(18,2)`.

*/
-- AlterTable
ALTER TABLE "Produtos" ALTER COLUMN "quantidade_atual" SET DATA TYPE DECIMAL(18,2);
