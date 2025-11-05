import prisma from "../prismaCliente.js";

export const findOrCreateCategoriaPrato = async (nome_categoria) => {
  let categoria = await prisma.categoriasPrato.findUnique({
    where: { nome_categoria }
  });

  if (!categoria) {
    categoria = await prisma.categoriasPrato.create({
      data: { nome_categoria }
    });
  }

  return categoria;
};

export const createPrato = async (dados) => {
  const { nome_prato, id_categoria_prato, tempo_preparo, valor_base_custo, descricao, ingredientes } = dados;

  const prato = await prisma.pratos.create({
    data: {
      nome_prato,
      id_categoria_prato,
      tempo_preparo,
      valor_base_custo,
      descricao,
    },
  });

  if (ingredientes && ingredientes.length > 0) {
    const ingredientesData = ingredientes.map(ing => ({
      id_prato: prato.id_prato,
      id_produto: ing.id_produto,
      quantidade: ing.quantidade,
      id_unidade_medida: ing.id_unidade_medida,
      valor_medida: ing.valor_medida ? parseFloat(ing.valor_medida) : 0,
    }));

    await prisma.prato_Ingrediente.createMany({ data: ingredientesData });
  }

  return prato;
};

export const pratoModel = {
  async listar() {
    const pratos = await prisma.pratos.findMany({
      include: { variacoes: true },
    });

    return pratos.map((p) => ({
      id: p.id_prato,
      nome: p.nome_prato,
      custoBase: Number(p.valor_base_custo || 0),
      variacoes: p.variacoes.map((v) => ({
        id_variacao: v.id_variacao,
        nome: v.nome_menu,
        multiplicador: Number(v.multiplicador_receita || 0),
        preco: Number(v.preco_venda || 0),
      })),
    }));
  },

  async salvarVariacoes(id_prato, variacoes) {
    for (const v of variacoes) {
      if (v.id_variacao) {
        await prisma.variacoesPorcao.update({
          where: { id_variacao: v.id_variacao },
          data: {
            nome_menu: v.nome_menu,
            multiplicador_receita: v.multiplicador_receita,
            preco_venda: v.preco_venda,
          },
        });
      } else {
        const existente = await prisma.variacoesPorcao.findFirst({
          where: { id_prato, nome_menu: v.nome_menu },
        });

        if (!existente) {
          await prisma.variacoesPorcao.create({
            data: {
              id_prato,
              nome_menu: v.nome_menu,
              multiplicador_receita: v.multiplicador_receita,
              preco_venda: v.preco_venda,
            },
          });
        }
      }
    }

    return { sucesso: true, mensagem: "Variações atualizadas com sucesso!" };
  },

  async removerVariacao(id_variacao) {
    const idNum = Number(id_variacao);
    if (isNaN(idNum)) throw new Error("ID inválido.");

    const deleted = await prisma.variacoesPorcao.delete({
      where: { id_variacao: idNum },
    });

    if (!deleted) throw new Error("Variação não encontrada.");
    return { sucesso: true, mensagem: "Variação removida com sucesso!" };
  },
};