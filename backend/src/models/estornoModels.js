import prisma from "../prismaCliente.js";
import { Prisma } from "@prisma/client";

export const listarVendasRapidasModel = async ({ page = 1, limit = 20 }) => {
    const skip = (page - 1) * limit;

    const totalVendas = await prisma.pedidos.count({
        where: {
            tipo_venda: "Venda_Rapida",
            status_pedido: "Concluido",
        },
    });

    const vendas = await prisma.pedidos.findMany({
        where: {
            tipo_venda: "Venda_Rapida",
            status_pedido: "Concluido",
        },
        include: {
            itens: {
                include: {
                    prato: true,
                    produto: true,
                    variacao: true,
                },
            },
        },
        orderBy: { data_hora_pedido: "desc" },
        skip,
        take: limit,
    });

    const resposta = vendas.map((venda) => {
        const itens = venda.itens.map((item) => {
            let nome = "Item";
            if (item.prato) nome = item.prato.nome_prato;
            else if (item.produto) nome = item.produto.nome_produto;
            else if (item.variacao) nome = item.variacao.nome_menu;

            return {
                id: item.id_item_pedido,
                id_prato: item.id_prato,
                id_produto: item.id_produto,
                id_variacao: item.id_variacao,
                nome,
                quantidade: Number(item.quantidade),
                preco_unitario: Number(item.preco_unitario),
            };
        });

        const total = itens.reduce((acc, i) => acc + i.preco_unitario * i.quantidade, 0);

        return {
            id: venda.id_pedido,
            numero: venda.id_pedido.toString().padStart(3, "0"),
            mesa: "Venda Rápida",
            data: venda.data_hora_pedido.toLocaleString(),
            formaPagamento: venda.forma_pagamento,
            itens,
            valor: total,
        };
    });

    return { page, limit, total: totalVendas, vendas: resposta };
};

export const estornarVendaRapidaModel = async ({ id_pedido, id_usuario_estornando }) => {

    const pedido = await prisma.pedidos.findUnique({
        where: { id_pedido: Number(id_pedido) },
        include: {
            itens: {
                include: {
                    variacao: {
                        include: {
                            prato: { include: { ingredientes: { include: { produto: true, unidade: true } } } },
                        },
                    },
                },
            },
        },
    });

    if (!pedido) throw new Error("pedido nao encontrado");
    if (pedido.status_pedido === "Estornado") throw new Error("pedido ja estornado");

    await prisma.pedidos.update({
        where: { id_pedido: Number(id_pedido) },
        data: { status_pedido: "Estornado" },
    });

    for (const item of pedido.itens) {
        const variacao = item.variacao;
        if (!variacao?.prato?.ingredientes) continue;

        const multiplicador = Number(variacao.multiplicador_receita);
        const qtdVendida = Number(item.quantidade);

        for (const ing of variacao.prato.ingredientes) {
            const pesoIngrediente = Number(ing.valor_medida);
            const consumoIngrediente = Number(pesoIngrediente * multiplicador * qtdVendida);
            const produtoAtual = await prisma.produtos.findUnique({
                where: { id_produto: ing.id_produto },
            });

            const quantidadeRealAtual = Number(produtoAtual.quantidade_real);
            const pesoPorUnidade = Number(produtoAtual.peso_por_unidade);
            const quantidadeAtual = Number(produtoAtual.quantidade_atual);

            const novaQuantidadeReal = quantidadeRealAtual + consumoIngrediente;

            let novaQuantidadeAtual = quantidadeAtual;

            const limiteProximaUnidade = pesoPorUnidade * (novaQuantidadeAtual + 1);

            if (novaQuantidadeReal >= limiteProximaUnidade) {
                novaQuantidadeAtual += 1;
            }

            await prisma.produtos.update({
                where: { id_produto: ing.id_produto },
                data: {
                    quantidade_real: novaQuantidadeReal,
                    quantidade_atual: novaQuantidadeAtual,
                },
            });

            await prisma.movimentacaoEstoque.create({
                data: {
                    id_produto: ing.id_produto,
                    tipo_movimentacao: "Entrada",
                    quantidade: consumoIngrediente,
                    id_unidade_medida: ing.id_unidade_medida,
                    observacoes: `Estorno da venda de ${variacao.nome_menu} do prato ${variacao.prato.nome_prato}`,
                    id_usuario: id_usuario_estornando,
                },
            });
        }
    }

    return { mensagem: "Venda estornada com sucesso" };
};

