import prisma from "../prismaCliente.js"

/**
 *
 * @param {number} idUsuario
 * @param {string} acao
 * @param {string} detalhes
 */
export async function registrarAuditoria(idUsuario, acao, detalhes) {
  try {
    await prisma.historico_Auditoria.create({
      data: {
        id_usuario: idUsuario,
        acao,
        detalhes,
      },
    });
  } catch (error) {
    console.error("erro ao registrar auditoria:", error);
  }
}
