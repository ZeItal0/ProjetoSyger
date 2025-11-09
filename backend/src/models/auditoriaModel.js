import prisma from "../prismaCliente.js";

export async function listarHistorico(page = 1, limit = 50) {
  const skip = (page - 1) * limit;

  const [historico, total] = await Promise.all([
    prisma.historico_Auditoria.findMany({
      include: {
        usuario: { select: { nome_completo: true, id_usuario: true } },
      },
      orderBy: { data_hora: "desc" },
      skip,
      take: limit,
    }),
    prisma.historico_Auditoria.count(),
  ]);

  const resultado = historico.map((item) => ({
    id: item.id_historico,
    usuario: item.usuario
      ? `${item.usuario.nome_completo} | #${item.usuario.id_usuario}`
      : "Usuário desconhecido",
    acao: item.acao,
    descricao: item.detalhes || "Sem descrição detalhada.",
    data: new Date(item.data_hora).toLocaleDateString("pt-BR"),
    hora: new Date(item.data_hora).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    registros: resultado,
  };
}