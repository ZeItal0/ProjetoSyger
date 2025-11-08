import prisma from "../prismaCliente.js";

export const findByName = async (nome_categoria) => {
  return await prisma.categoriasFinanceiras.findFirst({
    where: { nome_categoria },
  });
};

export const createCategoria = async (nome_categoria) => {
  return await prisma.categoriasFinanceiras.create({
    data: { nome_categoria },
  });
};
