
import prisma from "../prismaCliente.js";

export async function salvarMensagem({ id_remetente, id_destinatario, assunto, conteudo }) {
  try {
    const mensagem = await prisma.mensagensInternas.create({
      data: {
        id_remetente,
        id_destinatario,
        assunto,
        conteudo,
      },
    });
    return mensagem;
  } catch (error) {
    console.error("erro ao salvar mensagem:", error);
    throw error;
  }
}

export async function listarMensagensPorUsuario(idUsuario) {
  return await prisma.mensagensInternas.findMany({
    where: { id_destinatario: Number(idUsuario) },
    orderBy: { data_envio: "desc" },
  });
}
