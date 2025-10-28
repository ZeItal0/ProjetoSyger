import  prisma  from "../prismaCliente.js"

export const findOrCreateCategoria = async (nome_categoria) => {
  let categoria = await prisma.categoriasProduto.findUnique({ where: { nome_categoria } });
  if (!categoria) {
    categoria = await prisma.categoriasProduto.create({ data: { nome_categoria } });
  }
  return categoria;
};

export const findOrCreateUnidade = async (nome_unidade) => {
  let unidade = await prisma.unidadesMedida.findUnique({ where: { nome_unidade } });
  if (!unidade) {
    unidade = await prisma.unidadesMedida.create({ data: { nome_unidade } });
  }
  return unidade;
};

export const createProduto = async (dados) => {
  return await prisma.produtos.create({ data: dados });
};

export const vincularFornecedorProduto = async (id_fornecedor, id_produto) => {
  return await prisma.fornecedor_Produto.create({
    data: { id_fornecedor, id_produto },
  });
};

export const registrarMovimentacao = async (dados) => {
  return await prisma.movimentacaoEstoque.create({ data: dados });
};

export const listarInsumos = async () => {
  return await prisma.produtos.findMany({
    include: {
      categoria: true,
      unidade: true,
      fornecedores: { include: { fornecedor: true } },
    },
  });
};

export const deletarInsumo = async (produtoId) => {
  return await prisma.$transaction([
    prisma.fornecedor_Produto.deleteMany({ where: { id_produto: produtoId } }),
    prisma.movimentacaoEstoque.deleteMany({ where: { id_produto: produtoId } }),
    prisma.prato_Ingrediente.deleteMany({ where: { id_produto: produtoId } }),
    prisma.pedido_Itens.deleteMany({ where: { id_produto: produtoId } }),
    prisma.produtos.delete({ where: { id_produto: produtoId } }),
  ]);
};

export const findCategoriaByNome = async (nome_categoria) => {
  return prisma.categoriasProduto.findUnique({ where: { nome_categoria } });
};

export const findUnidadeByNome = async (nome_unidade) => {
  return prisma.unidadesMedida.findUnique({ where: { nome_unidade } });
};

export const atualizarProduto = async (id_produto, dados) => {
  return prisma.produtos.update({
    where: { id_produto: Number(id_produto) },
    data: dados,
  });
};