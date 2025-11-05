import prisma from "../prismaCliente.js"

export async function listarCardapioDoDia() {
  const pratos = await prisma.pratos.findMany({
    include: {
      categoria: true,
      variacoes: true,
    },
  });

  const resultado = pratos
    .filter((p) => p.variacoes && p.variacoes.length > 0)
    .map((p) => ({
      id: p.id_prato,
      nome: p.nome_prato,
      categoria: p.categoria?.nome_categoria || "Sem categoria",
      variacoes: p.variacoes.map((v) => ({
        id_variacao: v.id_variacao,
        nome: v.nome_menu,
        preco: Number(v.preco_venda || 0),
      })),
    }));

  return resultado;
}

export async function adicionarAoCardapioDoDia(variacoes) {
  let cardapio = await prisma.cardapio.findFirst({
    where: { status: "Ativo" },
  });

  if (!cardapio) {
    cardapio = await prisma.cardapio.create({
      data: {
        nome: "Cardápio do Dia",
        status: "Ativo",
        data: new Date(),
      },
    });
  }

  const registros = await Promise.all(
    variacoes.map(async ({ variacaoId, status }) => {
      const variacao = await prisma.variacoesPorcao.findUnique({
        where: { id_variacao: variacaoId },
        include: { prato: true },
      });

      if (!variacao) return null;

      return prisma.cardapioPratos.create({
        data: {
          id_cardapio: cardapio.id_cardapio,
          id_prato: variacao.id_prato,
          id_variacao: variacao.id_variacao,
          disponivel: status === "DISPONIVEL",
        },
      });
    })
  );

  return registros.filter(Boolean);
}

export async function buscarCardapioAtivo() {
  return await prisma.cardapio.findFirst({
    where: { status: "Ativo" },
  });
}

export async function buscarPratosDoCardapio(id_cardapio) {
  return await prisma.cardapioPratos.findMany({
    where: { id_cardapio },
    include: {
      prato: { include: { categoria: true } },
      variacao: true,
    },
  });
}

export async function removerPrato(id_cardapio_prato) {
  return await prisma.cardapioPratos.delete({
    where: { id_cardapio_prato: parseInt(id_cardapio_prato) },
  });
}

export async function buscarPratoPorId(id_cardapio_prato) {
  return await prisma.cardapioPratos.findUnique({
    where: { id_cardapio_prato: parseInt(id_cardapio_prato) },
  });
}

export async function atualizarStatusPrato(id_cardapio_prato, disponivel) {
  return await prisma.cardapioPratos.updateMany({
    where: { id_cardapio_prato: parseInt(id_cardapio_prato) },
    data: { disponivel: Boolean(disponivel) },
  });
}



