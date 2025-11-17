/*
  Warnings:

  - You are about to alter the column `quantidade_atual` on the `Produtos` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Produtos" ALTER COLUMN "quantidade_atual" SET DEFAULT 0,
ALTER COLUMN "quantidade_atual" SET DATA TYPE INTEGER;
