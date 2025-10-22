-- CreateEnum
CREATE TYPE "NivelAcesso" AS ENUM ('Administrador', 'Funcionario_Comum', 'Financeiro_Gerente');

-- CreateEnum
CREATE TYPE "StatusUsuario" AS ENUM ('Ativo', 'Suspenso', 'Inativo');

-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('Entrada', 'Saida', 'Reestoque', 'Ajuste');

-- CreateEnum
CREATE TYPE "TipoVenda" AS ENUM ('Venda_Rapida', 'Mesa', 'Marmita');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('Dinheiro', 'Cartao', 'Pix');

-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('Pendente', 'Concluido', 'Estornado');

-- CreateEnum
CREATE TYPE "StatusMesa" AS ENUM ('Aberta', 'Fechada');

-- CreateEnum
CREATE TYPE "StatusMarmita" AS ENUM ('Em_espera', 'Finalizado');

-- CreateEnum
CREATE TYPE "StatusDivida" AS ENUM ('A_pagar', 'Pago', 'Vencida', 'Cancelado_Estornado');

-- CreateEnum
CREATE TYPE "StatusCardapio" AS ENUM ('Ativo', 'Inativo');

-- CreateTable
CREATE TABLE "Usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nome_completo" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "usuario" VARCHAR(100) NOT NULL,
    "cnpj" VARCHAR(18),
    "senha_hash" VARCHAR(255) NOT NULL,
    "cargo" VARCHAR(100) NOT NULL,
    "nivel_acesso" "NivelAcesso" NOT NULL,
    "status" "StatusUsuario" NOT NULL DEFAULT 'Ativo',
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_ultima_atualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Fornecedores" (
    "id_fornecedor" SERIAL NOT NULL,
    "nome_empresa" VARCHAR(255) NOT NULL,
    "cnpj" VARCHAR(18),
    "nome_contato" VARCHAR(255),
    "email" VARCHAR(255),
    "telefone" VARCHAR(20),
    "inscricao_estadual" VARCHAR(50),
    "cep" VARCHAR(10),
    "rua" VARCHAR(255),
    "numero" VARCHAR(100),
    "bairro" VARCHAR(255),
    "observacoes" VARCHAR(500),
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fornecedores_pkey" PRIMARY KEY ("id_fornecedor")
);

-- CreateTable
CREATE TABLE "CategoriasProduto" (
    "id_categoria_produto" SERIAL NOT NULL,
    "nome_categoria" VARCHAR(100) NOT NULL,

    CONSTRAINT "CategoriasProduto_pkey" PRIMARY KEY ("id_categoria_produto")
);

-- CreateTable
CREATE TABLE "UnidadesMedida" (
    "id_unidade_medida" SERIAL NOT NULL,
    "nome_unidade" VARCHAR(50) NOT NULL,

    CONSTRAINT "UnidadesMedida_pkey" PRIMARY KEY ("id_unidade_medida")
);

-- CreateTable
CREATE TABLE "Produtos" (
    "id_produto" SERIAL NOT NULL,
    "nome_produto" VARCHAR(255) NOT NULL,
    "id_categoria_produto" INTEGER NOT NULL,
    "id_unidade_medida" INTEGER NOT NULL,
    "validade" TIMESTAMP(3),
    "quantidade_atual" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "quantidade_minima" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "forma_compra" VARCHAR(50),
    "custo_unitario" DECIMAL(65,30),
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_ultima_atualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Produtos_pkey" PRIMARY KEY ("id_produto")
);

-- CreateTable
CREATE TABLE "Fornecedor_Produto" (
    "id_fornecedor" INTEGER NOT NULL,
    "id_produto" INTEGER NOT NULL,

    CONSTRAINT "Fornecedor_Produto_pkey" PRIMARY KEY ("id_fornecedor","id_produto")
);

-- CreateTable
CREATE TABLE "MovimentacaoEstoque" (
    "id_movimentacao" SERIAL NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "tipo_movimentacao" "TipoMovimentacao" NOT NULL,
    "quantidade" DECIMAL(65,30) NOT NULL,
    "id_unidade_medida" INTEGER NOT NULL,
    "data_movimentacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER,
    "observacoes" VARCHAR(500),

    CONSTRAINT "MovimentacaoEstoque_pkey" PRIMARY KEY ("id_movimentacao")
);

-- CreateTable
CREATE TABLE "CategoriasPrato" (
    "id_categoria_prato" SERIAL NOT NULL,
    "nome_categoria" VARCHAR(100) NOT NULL,

    CONSTRAINT "CategoriasPrato_pkey" PRIMARY KEY ("id_categoria_prato")
);

-- CreateTable
CREATE TABLE "Pratos" (
    "id_prato" SERIAL NOT NULL,
    "nome_prato" VARCHAR(255) NOT NULL,
    "id_categoria_prato" INTEGER NOT NULL,
    "tempo_preparo" INTEGER,
    "valor_base_custo" DECIMAL(65,30),
    "descricao" VARCHAR(500),
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pratos_pkey" PRIMARY KEY ("id_prato")
);

-- CreateTable
CREATE TABLE "Prato_Ingrediente" (
    "id_prato" INTEGER NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "quantidade" DECIMAL(65,30) NOT NULL,
    "id_unidade_medida" INTEGER NOT NULL,

    CONSTRAINT "Prato_Ingrediente_pkey" PRIMARY KEY ("id_prato","id_produto")
);

-- CreateTable
CREATE TABLE "VariacoesPorcao" (
    "id_variacao" SERIAL NOT NULL,
    "id_prato" INTEGER NOT NULL,
    "nome_menu" VARCHAR(100) NOT NULL,
    "multiplicador_receita" DECIMAL(65,30),
    "preco_venda" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "VariacoesPorcao_pkey" PRIMARY KEY ("id_variacao")
);

-- CreateTable
CREATE TABLE "Adicionais" (
    "id_adicional" SERIAL NOT NULL,
    "nome_adicional" VARCHAR(255) NOT NULL,
    "preco" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Adicionais_pkey" PRIMARY KEY ("id_adicional")
);

-- CreateTable
CREATE TABLE "VariacaoPorcao_Adicional" (
    "id_variacao" INTEGER NOT NULL,
    "id_adicional" INTEGER NOT NULL,

    CONSTRAINT "VariacaoPorcao_Adicional_pkey" PRIMARY KEY ("id_variacao","id_adicional")
);

-- CreateTable
CREATE TABLE "Mesas" (
    "id_mesa" SERIAL NOT NULL,
    "numero_mesa" VARCHAR(50) NOT NULL,
    "status" "StatusMesa" NOT NULL DEFAULT 'Fechada',
    "capacidade" INTEGER,

    CONSTRAINT "Mesas_pkey" PRIMARY KEY ("id_mesa")
);

-- CreateTable
CREATE TABLE "Marmitas" (
    "id_marmita" SERIAL NOT NULL,
    "numero_marmita" VARCHAR(50) NOT NULL,
    "status" "StatusMarmita" NOT NULL DEFAULT 'Em_espera',

    CONSTRAINT "Marmitas_pkey" PRIMARY KEY ("id_marmita")
);

-- CreateTable
CREATE TABLE "Pedidos" (
    "id_pedido" SERIAL NOT NULL,
    "tipo_venda" "TipoVenda" NOT NULL,
    "id_mesa" INTEGER,
    "id_marmita" INTEGER,
    "data_hora_pedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "desconto" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "total_liquido" DECIMAL(65,30) NOT NULL,
    "forma_pagamento" "FormaPagamento" NOT NULL,
    "status_pedido" "StatusPedido" NOT NULL DEFAULT 'Pendente',
    "id_usuario" INTEGER,

    CONSTRAINT "Pedidos_pkey" PRIMARY KEY ("id_pedido")
);

-- CreateTable
CREATE TABLE "Pedido_Itens" (
    "id_item_pedido" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_prato" INTEGER,
    "id_produto" INTEGER,
    "id_variacao" INTEGER,
    "quantidade" DECIMAL(65,30) NOT NULL,
    "preco_unitario" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Pedido_Itens_pkey" PRIMARY KEY ("id_item_pedido")
);

-- CreateTable
CREATE TABLE "CategoriasFinanceiras" (
    "id_categoria_financeira" SERIAL NOT NULL,
    "nome_categoria" VARCHAR(100) NOT NULL,

    CONSTRAINT "CategoriasFinanceiras_pkey" PRIMARY KEY ("id_categoria_financeira")
);

-- CreateTable
CREATE TABLE "Despesas" (
    "id_despesa" SERIAL NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "id_fornecedor" INTEGER,
    "valor_original" DECIMAL(65,30) NOT NULL,
    "id_categoria_financeira" INTEGER NOT NULL,
    "data_vencimento" TIMESTAMP(3) NOT NULL,
    "status_divida" "StatusDivida" NOT NULL,
    "data_pagamento" TIMESTAMP(3),
    "data_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario_registro" INTEGER,

    CONSTRAINT "Despesas_pkey" PRIMARY KEY ("id_despesa")
);

-- CreateTable
CREATE TABLE "Historico_Auditoria" (
    "id_historico" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "acao" VARCHAR(255) NOT NULL,
    "detalhes" VARCHAR(500),
    "data_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Historico_Auditoria_pkey" PRIMARY KEY ("id_historico")
);

-- CreateTable
CREATE TABLE "MensagensInternas" (
    "id_mensagem" SERIAL NOT NULL,
    "id_remetente" INTEGER NOT NULL,
    "id_destinatario" INTEGER,
    "assunto" VARCHAR(255),
    "conteudo" VARCHAR(1000) NOT NULL,
    "data_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lida" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MensagensInternas_pkey" PRIMARY KEY ("id_mensagem")
);

-- CreateTable
CREATE TABLE "Alertas" (
    "id_alerta" SERIAL NOT NULL,
    "tipo_alerta" VARCHAR(100),
    "mensagem" VARCHAR(500) NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario_destino" INTEGER,
    "lido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Alertas_pkey" PRIMARY KEY ("id_alerta")
);

-- CreateTable
CREATE TABLE "Cardapio" (
    "id_cardapio" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusCardapio" NOT NULL DEFAULT 'Ativo',

    CONSTRAINT "Cardapio_pkey" PRIMARY KEY ("id_cardapio")
);

-- CreateTable
CREATE TABLE "CardapioPratos" (
    "id_cardapio_prato" SERIAL NOT NULL,
    "id_cardapio" INTEGER NOT NULL,
    "id_prato" INTEGER NOT NULL,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CardapioPratos_pkey" PRIMARY KEY ("id_cardapio_prato")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_usuario_key" ON "Usuarios"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_cnpj_key" ON "Usuarios"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedores_cnpj_key" ON "Fornecedores"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriasProduto_nome_categoria_key" ON "CategoriasProduto"("nome_categoria");

-- CreateIndex
CREATE UNIQUE INDEX "UnidadesMedida_nome_unidade_key" ON "UnidadesMedida"("nome_unidade");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriasPrato_nome_categoria_key" ON "CategoriasPrato"("nome_categoria");

-- CreateIndex
CREATE UNIQUE INDEX "Mesas_numero_mesa_key" ON "Mesas"("numero_mesa");

-- CreateIndex
CREATE UNIQUE INDEX "Marmitas_numero_marmita_key" ON "Marmitas"("numero_marmita");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriasFinanceiras_nome_categoria_key" ON "CategoriasFinanceiras"("nome_categoria");

-- AddForeignKey
ALTER TABLE "Produtos" ADD CONSTRAINT "Produtos_id_categoria_produto_fkey" FOREIGN KEY ("id_categoria_produto") REFERENCES "CategoriasProduto"("id_categoria_produto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produtos" ADD CONSTRAINT "Produtos_id_unidade_medida_fkey" FOREIGN KEY ("id_unidade_medida") REFERENCES "UnidadesMedida"("id_unidade_medida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fornecedor_Produto" ADD CONSTRAINT "Fornecedor_Produto_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "Fornecedores"("id_fornecedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fornecedor_Produto" ADD CONSTRAINT "Fornecedor_Produto_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "Produtos"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoEstoque" ADD CONSTRAINT "MovimentacaoEstoque_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "Produtos"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoEstoque" ADD CONSTRAINT "MovimentacaoEstoque_id_unidade_medida_fkey" FOREIGN KEY ("id_unidade_medida") REFERENCES "UnidadesMedida"("id_unidade_medida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoEstoque" ADD CONSTRAINT "MovimentacaoEstoque_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pratos" ADD CONSTRAINT "Pratos_id_categoria_prato_fkey" FOREIGN KEY ("id_categoria_prato") REFERENCES "CategoriasPrato"("id_categoria_prato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prato_Ingrediente" ADD CONSTRAINT "Prato_Ingrediente_id_prato_fkey" FOREIGN KEY ("id_prato") REFERENCES "Pratos"("id_prato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prato_Ingrediente" ADD CONSTRAINT "Prato_Ingrediente_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "Produtos"("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prato_Ingrediente" ADD CONSTRAINT "Prato_Ingrediente_id_unidade_medida_fkey" FOREIGN KEY ("id_unidade_medida") REFERENCES "UnidadesMedida"("id_unidade_medida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariacoesPorcao" ADD CONSTRAINT "VariacoesPorcao_id_prato_fkey" FOREIGN KEY ("id_prato") REFERENCES "Pratos"("id_prato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariacaoPorcao_Adicional" ADD CONSTRAINT "VariacaoPorcao_Adicional_id_variacao_fkey" FOREIGN KEY ("id_variacao") REFERENCES "VariacoesPorcao"("id_variacao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariacaoPorcao_Adicional" ADD CONSTRAINT "VariacaoPorcao_Adicional_id_adicional_fkey" FOREIGN KEY ("id_adicional") REFERENCES "Adicionais"("id_adicional") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedidos" ADD CONSTRAINT "Pedidos_id_mesa_fkey" FOREIGN KEY ("id_mesa") REFERENCES "Mesas"("id_mesa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedidos" ADD CONSTRAINT "Pedidos_id_marmita_fkey" FOREIGN KEY ("id_marmita") REFERENCES "Marmitas"("id_marmita") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedidos" ADD CONSTRAINT "Pedidos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido_Itens" ADD CONSTRAINT "Pedido_Itens_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "Pedidos"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido_Itens" ADD CONSTRAINT "Pedido_Itens_id_prato_fkey" FOREIGN KEY ("id_prato") REFERENCES "Pratos"("id_prato") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido_Itens" ADD CONSTRAINT "Pedido_Itens_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "Produtos"("id_produto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido_Itens" ADD CONSTRAINT "Pedido_Itens_id_variacao_fkey" FOREIGN KEY ("id_variacao") REFERENCES "VariacoesPorcao"("id_variacao") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despesas" ADD CONSTRAINT "Despesas_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "Fornecedores"("id_fornecedor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despesas" ADD CONSTRAINT "Despesas_id_categoria_financeira_fkey" FOREIGN KEY ("id_categoria_financeira") REFERENCES "CategoriasFinanceiras"("id_categoria_financeira") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despesas" ADD CONSTRAINT "Despesas_id_usuario_registro_fkey" FOREIGN KEY ("id_usuario_registro") REFERENCES "Usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historico_Auditoria" ADD CONSTRAINT "Historico_Auditoria_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MensagensInternas" ADD CONSTRAINT "MensagensInternas_id_remetente_fkey" FOREIGN KEY ("id_remetente") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MensagensInternas" ADD CONSTRAINT "MensagensInternas_id_destinatario_fkey" FOREIGN KEY ("id_destinatario") REFERENCES "Usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alertas" ADD CONSTRAINT "Alertas_id_usuario_destino_fkey" FOREIGN KEY ("id_usuario_destino") REFERENCES "Usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardapioPratos" ADD CONSTRAINT "CardapioPratos_id_cardapio_fkey" FOREIGN KEY ("id_cardapio") REFERENCES "Cardapio"("id_cardapio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardapioPratos" ADD CONSTRAINT "CardapioPratos_id_prato_fkey" FOREIGN KEY ("id_prato") REFERENCES "Pratos"("id_prato") ON DELETE RESTRICT ON UPDATE CASCADE;
