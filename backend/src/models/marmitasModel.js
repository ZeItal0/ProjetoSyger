import prisma from "../prismaCliente.js";
import { Prisma } from "@prisma/client";
import { schemaCriarMarmita } from "../validations/marmitaSchema.js";
import { verificarEstoqueDaVariacao } from "../services/verificarEstoqueDaVariacao.js";
import { enviarNotificacaoUsuario } from "../services/notificacoes.js";
import { getSocket } from "../../socketServer.js";

export const criarMarmitaModel = async (dados) => {
    const { error, value } = schemaCriarMarmita.validate(dados);
    if (error) { throw new Error(error.details[0].message); }

    const { numero_marmita } = value;

    const marmita = await prisma.marmitas.create({
        data: {
            numero_marmita,
            status: "Em_espera",
        },
    });

    return marmita;
};


export const listarMarmitasModel = async () => {
    const marmitas = await prisma.marmitas.findMany({
        where: { status: "Em_espera" },
        include: {
            pedidos: {
                where: { status_pedido: "Pendente" },
                include: {
                    itens: {
                        include: {
                            prato: true,
                            produto: true,
                            variacao: true,
                        },
                    },
                },
            },
        },
    });

    return marmitas.map((m) => {
        const pedido = m.pedidos[0] || { itens: [] };

        const itens = pedido.itens.map((item) => {
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
                preco_unitario: Number(item.preco_unitario),
                quantidade: Number(item.quantidade),
            };
        });

        const total = itens.reduce((acc, i) => acc + i.preco_unitario * i.quantidade, 0);

        return {
            id: m.id_marmita,
            numero_marmita: m.numero_marmita,
            nome: `Marmita ${m.numero_marmita}`,
            status: m.status,
            total,
            itens,
        };
    });
};

export const adicionarItemMarmitaModel = async ({ id_marmita, id_prato, id_variacao, id_produto, quantidade, preco_unitario, id_usuario }) => {

    let pedido = await prisma.pedidos.findFirst({
        where: { id_marmita: Number(id_marmita), status_pedido: "Pendente" },
    });

    if (!pedido) {
        pedido = await prisma.pedidos.create({
            data: {
                id_marmita: Number(id_marmita),
                tipo_venda: "Marmita",
                subtotal: 0,
                total_liquido: 0,
                forma_pagamento: "Dinheiro",
            },
        });
    }

    const item = await prisma.pedido_Itens.create({
        data: {
            id_pedido: pedido.id_pedido,
            id_prato: id_prato || null,
            id_variacao: id_variacao || null,
            id_produto: id_produto || null,
            quantidade: Number(quantidade),
            preco_unitario: Number(preco_unitario),
        },
    });

    if (id_variacao) {

        const variacao = await prisma.variacoesPorcao.findUnique({
            where: { id_variacao: Number(id_variacao) },
            include: {
                prato: {
                    include: {
                        ingredientes: { include: { produto: true, unidade: true } }
                    }
                }
            }
        });

        if (variacao?.prato) {

            const pesoPronto = Number(variacao.prato.peso_pronto_total);
            const multiplicador = Number(variacao.multiplicador_receita);
            const qtdVendida = Number(quantidade);
            const pesoConsumido = pesoPronto * multiplicador * qtdVendida;

            for (const ing of variacao.prato.ingredientes) {

                const pesoIngrediente = Number(ing.valor_medida);
                const consumoIngrediente = (pesoIngrediente / pesoPronto) * pesoConsumido;

                const produtoAtual = await prisma.produtos.findUnique({
                    where: { id_produto: ing.id_produto }
                });

                const novaQuantidadeReal = produtoAtual.quantidade_real - consumoIngrediente;
                let novaQuantidadeAtual = produtoAtual.quantidade_atual;

                if (novaQuantidadeReal < produtoAtual.peso_por_unidade * novaQuantidadeAtual) {
                    novaQuantidadeAtual -= 1;
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
                        tipo_movimentacao: "Saida",
                        quantidade: consumoIngrediente,
                        id_unidade_medida: ing.id_unidade_medida,
                        observacoes: `Saída pela montagem da marmita ${id_marmita}`,
                        id_usuario,
                    },
                });
            }
        }

        const esgotado = await verificarEstoqueDaVariacao(id_variacao);

        if (esgotado) {
            await enviarNotificacaoUsuario({
                id_usuario,
                titulo: "Ingrediente insuficiente",
                conteudo: "Uma variação foi marcada como esgotada automaticamente por favor fazer Reestoque."
            });
        }
    }

    return item;
};

export const removerItemMarmitaModel = async (id_item_pedido, id_usuario) => {
    const itemRemovido = await prisma.pedido_Itens.delete({
        where: { id_item_pedido: Number(id_item_pedido) },
    });

    const pedido = await prisma.pedidos.findUnique({
        where: { id_pedido: itemRemovido.id_pedido },
        include: { itens: true },
    });

    if (!pedido) throw new Error("Pedido da marmita não encontrado");

    const subtotal = pedido.itens.reduce(
        (acc, it) => acc + Number(it.preco_unitario) * Number(it.quantidade),
        0
    );

    await prisma.pedidos.update({
        where: { id_pedido: pedido.id_pedido },
        data: { subtotal, total_liquido: subtotal },
    });

    if (itemRemovido.id_variacao) {
        const variacao = await prisma.variacoesPorcao.findUnique({
            where: { id_variacao: itemRemovido.id_variacao },
            include: {
                prato: { include: { ingredientes: { include: { produto: true, unidade: true } } } },
            },
        });

        if (variacao?.prato?.ingredientes) {
            const pesoPronto = Number(variacao.prato.peso_pronto_total);
            const multiplicador = Number(variacao.multiplicador_receita);
            const qtdRemovida = Number(itemRemovido.quantidade);
            const pesoConsumido = pesoPronto * multiplicador * qtdRemovida;

            for (const ing of variacao.prato.ingredientes) {
                const pesoIngrediente = Number(ing.valor_medida);
                const consumoIngrediente = (pesoIngrediente / pesoPronto) * pesoConsumido;

                const produtoAtual = await prisma.produtos.findUnique({
                    where: { id_produto: ing.id_produto },
                });

                const novaQuantidadeReal = new Prisma.Decimal(produtoAtual.quantidade_real).plus(consumoIngrediente);

                let novaQuantidadeAtual = Number(produtoAtual.quantidade_atual);
                const limiteProximaUnidade =
                    Number(produtoAtual.peso_por_unidade) * (novaQuantidadeAtual + 1);

                if (novaQuantidadeReal.toNumber() >= limiteProximaUnidade) {
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
                        observacoes: `Reestoque pela remoção do item da marmita`,
                        id_usuario,
                    },
                });

                await prisma.cardapioPratos.updateMany({
                    where: { id_variacao: variacao.id_variacao },
                    data: { disponivel: true },
                });

                const socket = getSocket();
                if (socket) {
                    socket.emit("cardapio_restaurado", { id_variacao: variacao.id_variacao });
                }
            }
        }
    }

    return true;
};

export const finalizarMarmitaModel = async ({ id_marmita, forma_pagamento, id_usuario }) => {
  const pedido = await prisma.pedidos.findFirst({
    where: { id_marmita: Number(id_marmita), status_pedido: "Pendente" },
    include: { itens: true },
  });

  if (!pedido) throw new Error("Marmita não possui pedido em aberto");

  const subtotal = pedido.itens.reduce(
    (acc, i) => acc + Number(i.preco_unitario) * Number(i.quantidade),
    0
  );

  const forma_pagamento_enum = (() => {
    switch ((forma_pagamento || "").toLowerCase()) {
      case "dinheiro":
        return "Dinheiro";
      case "cartao":
        return "Cartao";
      case "pix":
        return "Pix";
      default:
        return "Dinheiro";
    }
  })();

  await prisma.pedidos.update({
    where: { id_pedido: pedido.id_pedido },
    data: {
      subtotal,
      total_liquido: subtotal,
      status_pedido: "Concluido",
      forma_pagamento: forma_pagamento_enum,
    },
  });

  await prisma.marmitas.update({
    where: { id_marmita: Number(id_marmita) },
    data: { status: "Finalizado" },
  });

  return pedido;
};

