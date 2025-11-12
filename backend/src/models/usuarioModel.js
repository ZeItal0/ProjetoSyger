import prisma from "../prismaCliente.js";

export const listarUsuarios = async (page = 1, limit = 15) => {
  const skip = (page - 1) * limit;

  const usuarios = await prisma.usuarios.findMany({
    select: {
      id_usuario: true,
      nome_completo: true,
      email: true,
      data_cadastro: true,
      status: true,
    },
    orderBy: { data_cadastro: "desc" },
    skip,
    take: limit,
  });

  const total = await prisma.usuarios.count();

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    registros: usuarios.map((u) => ({
      id: `#${u.id_usuario}`,
      nome: u.nome_completo,
      email: u.email,
      registro: new Date(u.data_cadastro).toLocaleDateString("pt-BR"),
      status: u.status,
    })),
  };
};

export const pausarUsuario = async (id_usuario) => {
  
  const usuario = await prisma.usuarios.findUnique({
    where: { id_usuario: Number(id_usuario) },
  });

  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  const usuarioAtualizado = await prisma.usuarios.update({
    where: { id_usuario: Number(id_usuario) },
    data: { status: "Suspenso" },
  });

  return usuarioAtualizado;
};

export const reativarUsuario = async (id_usuario) => {
  const usuario = await prisma.usuarios.update({
    where: { id_usuario },
    data: { status: "Ativo" },
  });

  return {
    mensagem: `Usuário ${usuario.nome_completo} reativado com sucesso.`,
  };
};

export const autorizarUsuario = async (id_usuario) => {
  const usuario = await prisma.usuarios.findUnique({
    where: { id_usuario: Number(id_usuario) },
  });

  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  if (usuario.status !== "Inativo") {
    throw new Error("Apenas usuários inativos podem ser autorizados.");
  }

  const usuarioAtualizado = await prisma.usuarios.update({
    where: { id_usuario: Number(id_usuario) },
    data: { status: "Ativo" },
  });

  return usuarioAtualizado;
};

export const excluirUsuario = async (id_usuario) => {
  const usuario = await prisma.usuarios.findUnique({
    where: { id_usuario },
  });

  if (!usuario) {
    throw new Error("usuário nao encontrado.");
  }

  const usuarioAtualizado = await prisma.usuarios.update({
    where: { id_usuario },
    data: { 
      status: "Inativo", 
      data_ultima_atualizacao: new Date()
    },
  });

  return usuarioAtualizado;
};

export const listarUsuariosAtivos = async () => {
  const usuarios = await prisma.usuarios.findMany({
    where: { status: "Ativo" },
    select: {
      id_usuario: true,
      nome_completo: true,
    },
    orderBy: { nome_completo: "asc" },
  });

  return usuarios.map((u) => ({
    id: u.id_usuario,
    nome: u.nome_completo,
  }));
};

