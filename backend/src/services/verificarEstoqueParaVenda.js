import prisma from "../prismaCliente.js";

export async function verificarEstoqueParaVenda(id_variacao, qtdVendida) {
  const variacao = await prisma.variacoesPorcao.findUnique({
    where: { id_variacao: Number(id_variacao) },
    include: {
      prato: {
        include: {
          ingredientes: {
            include: { produto: true }
          }
        }
      }
    }
  });

  if (!variacao) {
    throw new Error("Variação não encontrada");
  }

  const pesoPronto = Number(variacao.prato.peso_pronto_total);
  const multiplicador = Number(variacao.multiplicador_receita ?? 1);
  const pesoConsumido = pesoPronto * multiplicador * qtdVendida;

  for (const ing of variacao.prato.ingredientes) {
    const produto = ing.produto;
    const pesoIngrediente = Number(ing.valor_medida);
    const consumoIngrediente = (pesoIngrediente / pesoPronto) * pesoConsumido;
    const estoqueReal = Number(produto.quantidade_real);

    if (estoqueReal < consumoIngrediente) {
      return {
        ok: false,
        produto: produto.nome_produto,
        ingrediente: produto.nome_produto,
        quantidadeDisponivel: estoqueReal,
      };
    }
  }

  return { ok: true };
}
