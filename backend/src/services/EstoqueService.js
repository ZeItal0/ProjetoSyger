import prisma from "../prismaCliente.js";

export async function listarProdutosEstoqueBaixo() {
  const produtos = await prisma.produtos.findMany({
    where: { ativo: true },
    include: {
      categoria: true,
      unidade: true,
      fornecedores: { include: { fornecedor: true } },
    },
  });

  return produtos.filter((p) => p.quantidade_atual <= p.quantidade_minima);
}
