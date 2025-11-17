import prisma from "../prismaCliente.js";
import { schemaCriarMesa } from "../validations/mesaSchema.js";

export const criarMesaModel = async (dados) => {
  const { error, value } = schemaCriarMesa.validate(dados);

  if (error) throw new Error(error.details[0].message);

  const { numero_mesa } = value;

  const mesa = await prisma.mesas.create({
    data: {
      numero_mesa,
      capacidade: 0,
      status: "Aberta",
    },
  });

  return mesa;
};

export const listarMesasAbertasModel = async () => {
  const mesas = await prisma.mesas.findMany({
    where: { status: "Aberta" },
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

  return mesas.map((mesa) => {
    const pedido = mesa.pedidos[0] || { itens: [] };

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
        preco_unitario: parseFloat(item.preco_unitario),
        quantidade: parseFloat(item.quantidade),
      };
    });

    const total = itens.reduce((acc, i) => acc + i.preco_unitario * i.quantidade, 0);

    return {
      id: mesa.id_mesa,
      numero_mesa: mesa.numero_mesa,
      nome: `Mesa ${mesa.numero_mesa}`,
      status: mesa.status.toLowerCase(),
      total,
      itens,
    };
  });
};

export const adicionarItemMesaModel = async ({ id_mesa, id_prato, id_variacao, id_produto, quantidade, preco_unitario }) => {
  let pedido = await prisma.pedidos.findFirst({
    where: { id_mesa: Number(id_mesa), status_pedido: "Pendente" },
  });

  if (!pedido) {
    pedido = await prisma.pedidos.create({
      data: {
        id_mesa: Number(id_mesa),
        tipo_venda: "Mesa",
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

  return item;
};

export const removerItemMesaModel = async (id_item_pedido) => {
  const itemRemovido = await prisma.pedido_Itens.delete({
    where: { id_item_pedido: Number(id_item_pedido) },
  });

  const pedido = await prisma.pedidos.findUnique({
    where: { id_pedido: itemRemovido.id_pedido },
    include: { itens: true },
  });

  const subtotal = pedido.itens.reduce(
    (acc, it) => acc + Number(it.preco_unitario) * Number(it.quantidade),
    0
  );

  await prisma.pedidos.update({
    where: { id_pedido: pedido.id_pedido },
    data: { subtotal, total_liquido: subtotal },
  });

  return true;
};

export const finalizarMesaModel = async ({ id_mesa, forma_pagamento, id_usuario }) => {
  const pedido = await prisma.pedidos.findFirst({
    where: { id_mesa: Number(id_mesa), status_pedido: "Pendente" },
    include: { itens: true },
  });

  if (!pedido) throw new Error("Mesa não possui pedido em aberto");

  const subtotal = pedido.itens.reduce((acc, i) => acc + i.preco_unitario * i.quantidade, 0);
  const totalLiquido = subtotal;

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
      total_liquido: totalLiquido,
      status_pedido: "Concluido",
      forma_pagamento: forma_pagamento_enum,
    },
  });

  await prisma.mesas.update({
    where: { id_mesa: Number(id_mesa) },
    data: { status: "Fechada" },
  });

  for (const item of pedido.itens) {
    const variacao = await prisma.variacoesPorcao.findUnique({
      where: { id_variacao: item.id_variacao },
      include: {
        prato: { include: { ingredientes: { include: { produto: true, unidade: true } } } },
      },
    });

    if (!variacao?.prato) continue;

    const pesoPronto = Number(variacao.prato.peso_pronto_total);
    const multiplicador = Number(variacao.multiplicador_receita);
    const qtdVendida = Number(item.quantidade);
    const pesoConsumido = pesoPronto * multiplicador * qtdVendida;

    for (const ing of variacao.prato.ingredientes) {
      const pesoIngrediente = Number(ing.valor_medida);
      const consumoIngrediente = (pesoIngrediente / pesoPronto) * pesoConsumido;
      const consumoUnidade = consumoIngrediente / ing.produto.peso_por_unidade;

      await prisma.produtos.update({
        where: { id_produto: ing.id_produto },
        data: {
          quantidade_real: { decrement: consumoIngrediente },
          quantidade_atual: { decrement: consumoUnidade },
        },
      });

      await prisma.movimentacaoEstoque.create({
        data: {
          id_produto: ing.id_produto,
          tipo_movimentacao: "Saida",
          quantidade: consumoIngrediente,
          id_unidade_medida: ing.id_unidade_medida,
          observacoes: `Saída pela venda da mesa ${id_mesa}`,
          id_usuario,
        },
      });
    }
  }

  return pedido;
};
