import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const findUserByEmailOrUsuario = async (email, usuario) => {
  return await prisma.Usuarios.findFirst({
    where: { OR: [{ email }, { usuario }] },
  });
};

export const createUser = async (userData) => {
  return await prisma.Usuarios.create({ data: userData });
};

export const findUserByUsuario = async (usuario) => {
  return await prisma.Usuarios.findUnique({ where: { usuario } });
};

export const findUserById = async (id) => {
  return await prisma.Usuarios.findUnique({ where: { id_usuario: id } });
};

