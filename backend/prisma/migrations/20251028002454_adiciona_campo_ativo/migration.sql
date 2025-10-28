-- DropForeignKey
ALTER TABLE "public"."CardapioPratos" DROP CONSTRAINT "CardapioPratos_id_cardapio_fkey";

-- DropForeignKey
ALTER TABLE "public"."CardapioPratos" DROP CONSTRAINT "CardapioPratos_id_prato_fkey";

-- DropForeignKey
ALTER TABLE "public"."Fornecedor_Produto" DROP CONSTRAINT "Fornecedor_Produto_id_fornecedor_fkey";

-- DropForeignKey
ALTER TABLE "public"."Fornecedor_Produto" DROP CONSTRAINT "Fornecedor_Produto_id_produto_fkey";

-- DropForeignKey
ALTER TABLE "public"."MovimentacaoEstoque" DROP CONSTRAINT "MovimentacaoEstoque_id_produto_fkey";

-- DropForeignKey
ALTER TABLE "public"."Prato_Ingrediente" DROP CONSTRAINT "Prato_Ingrediente_id_prato_fkey";

-- DropForeignKey
ALTER TABLE "public"."Prato_Ingrediente" DROP CONSTRAINT "Prato_Ingrediente_id_produto_fkey";

-- DropForeignKey
ALTER TABLE "public"."VariacaoPorcao_Adicional" DROP CONSTRAINT "VariacaoPorcao_Adicional_id_adicional_fkey";

-- DropForeignKey
ALTER TABLE "public"."VariacaoPorcao_Adicional" DROP CONSTRAINT "VariacaoPorcao_Adicional_id_variacao_fkey";

-- DropForeignKey
ALTER TABLE "public"."VariacoesPorcao" DROP CONSTRAINT "VariacoesPorcao_id_prato_fkey";

-- AlterTable
ALTER TABLE "Fornecedores" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Pratos" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Produtos" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "Fornecedor_Produto" ADD CONSTRAINT "Fornecedor_Produto_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "Fornecedores"("id_fornecedor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fornecedor_Produto" ADD CONSTRAINT "Fornecedor_Produto_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "Produtos"("id_produto") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoEstoque" ADD CONSTRAINT "MovimentacaoEstoque_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "Produtos"("id_produto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prato_Ingrediente" ADD CONSTRAINT "Prato_Ingrediente_id_prato_fkey" FOREIGN KEY ("id_prato") REFERENCES "Pratos"("id_prato") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prato_Ingrediente" ADD CONSTRAINT "Prato_Ingrediente_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "Produtos"("id_produto") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariacoesPorcao" ADD CONSTRAINT "VariacoesPorcao_id_prato_fkey" FOREIGN KEY ("id_prato") REFERENCES "Pratos"("id_prato") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariacaoPorcao_Adicional" ADD CONSTRAINT "VariacaoPorcao_Adicional_id_variacao_fkey" FOREIGN KEY ("id_variacao") REFERENCES "VariacoesPorcao"("id_variacao") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariacaoPorcao_Adicional" ADD CONSTRAINT "VariacaoPorcao_Adicional_id_adicional_fkey" FOREIGN KEY ("id_adicional") REFERENCES "Adicionais"("id_adicional") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardapioPratos" ADD CONSTRAINT "CardapioPratos_id_cardapio_fkey" FOREIGN KEY ("id_cardapio") REFERENCES "Cardapio"("id_cardapio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardapioPratos" ADD CONSTRAINT "CardapioPratos_id_prato_fkey" FOREIGN KEY ("id_prato") REFERENCES "Pratos"("id_prato") ON DELETE CASCADE ON UPDATE CASCADE;
