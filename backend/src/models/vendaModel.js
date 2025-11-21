import prisma from "../prismaCliente.js";
import { verificarEstoqueParaVenda } from "../services/verificarEstoqueParaVenda.js";

export const criarPedido = async ({ tipo_venda, forma_pagamento, itens, id_usuario }) => {

    for (const item of itens) {
        const estoque = await verificarEstoqueParaVenda(item.id_variacao, item.quantidade);
        if (!estoque.ok) {
            throw new Error(`Venda excede o estoque disponível do produto "${estoque.produto}" (ingrediente: ${estoque.ingrediente})`);
        }
    }

    const pedido = await prisma.pedidos.create({
        data: {
            tipo_venda,
            forma_pagamento,
            subtotal: itens.reduce((acc, i) => acc + i.preco_unitario * i.quantidade, 0),
            total_liquido: itens.reduce((acc, i) => acc + i.preco_unitario * i.quantidade, 0),
            id_usuario,
            status_pedido: "Concluido",
        },
    });

    for (const item of itens) {
        const variacao = await prisma.variacoesPorcao.findUnique({
            where: { id_variacao: item.id_variacao },
            include: {
                prato: {
                    include: {
                        ingredientes: { include: { produto: true, unidade: true } }
                    }
                }
            },
        });

        await prisma.pedido_Itens.create({
            data: {
                id_pedido: pedido.id_pedido,
                id_variacao: item.id_variacao,
                id_prato: variacao?.id_prato || null,
                quantidade: item.quantidade,
                preco_unitario: item.preco_unitario,
            },
        });

        const pesoPronto = Number(variacao.prato.peso_pronto_total);
        const multiplicador = Number(variacao.multiplicador_receita);
        const qtdVendida = Number(item.quantidade);
        const pesoConsumido = pesoPronto * multiplicador * qtdVendida;

        for (const ing of variacao.prato.ingredientes) {
            const pesoIngrediente = Number(ing.valor_medida);
            const consumoIngrediente = (pesoIngrediente / pesoPronto) * pesoConsumido;

            const produtoAtual = await prisma.produtos.findUnique({
                where: { id_produto: ing.id_produto },
            });

            const novaQuantidadeReal = produtoAtual.quantidade_real - consumoIngrediente;

            const unidadesRestantes = Math.floor(
                novaQuantidadeReal / Number(produtoAtual.peso_por_unidade)
            );

            await prisma.produtos.update({
                where: { id_produto: ing.id_produto },
                data: {
                    quantidade_real: novaQuantidadeReal,
                    quantidade_atual: unidadesRestantes
                },
            });


            await prisma.movimentacaoEstoque.create({
                data: {
                    id_produto: ing.id_produto,
                    tipo_movimentacao: "Saida",
                    quantidade: consumoIngrediente,
                    id_unidade_medida: ing.id_unidade_medida,
                    observacoes: `Saída pela venda de ${variacao.nome_menu} do prato ${variacao.prato.nome_prato}`,
                    id_usuario,
                },
            });
        }
    }

    return pedido;
};
