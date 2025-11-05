-- DropForeignKey
ALTER TABLE "public"."CardapioPratos" DROP CONSTRAINT "CardapioPratos_id_variacao_fkey";

-- AddForeignKey
ALTER TABLE "CardapioPratos" ADD CONSTRAINT "CardapioPratos_id_variacao_fkey" FOREIGN KEY ("id_variacao") REFERENCES "VariacoesPorcao"("id_variacao") ON DELETE CASCADE ON UPDATE CASCADE;
