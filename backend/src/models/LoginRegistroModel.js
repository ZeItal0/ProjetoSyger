import  prisma  from "../prismaCliente.js"

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

export const findActiveUserByUsuario = async (usuario) => {
  const user = await prisma.Usuarios.findUnique({
    where: { usuario },
  });

  if (!user) {
    throw new Error("esuario nao encontrado");
  }

  if (user.status === "Inativo" || user.status === "Suspenso") {
    throw new Error("Usuario sem autorização para acessar o sistema");
  }

  return user;
};

