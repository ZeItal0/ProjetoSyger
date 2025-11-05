-- AlterTable
ALTER TABLE "CardapioPratos" ADD COLUMN     "id_variacao" INTEGER;

-- AddForeignKey
ALTER TABLE "CardapioPratos" ADD CONSTRAINT "CardapioPratos_id_variacao_fkey" FOREIGN KEY ("id_variacao") REFERENCES "VariacoesPorcao"("id_variacao") ON DELETE SET NULL ON UPDATE CASCADE;
