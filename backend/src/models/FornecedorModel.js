import  prisma  from "../prismaCliente.js"

export const findByCNPJ = async (cnpj) => {
  return await prisma.fornecedores.findFirst({ where: { cnpj } });
};

export const createFornecedor = async (dados) => {
  return await prisma.fornecedores.create({ data: dados });
};

export const listarFornecedores = async () => {
  return await prisma.fornecedores.findMany({
    orderBy: { nome_empresa: "desc" },
  });
};