import prisma from "../prismaCliente.js";

export const criarAlerta = async ({ tipo_alerta, mensagem, id_usuario_destino = null }) => {
  try {
    return await prisma.alertas.create({
      data: {
        tipo_alerta,
        mensagem,
        id_usuario_destino,
      },
    });
  } catch (error) {
    console.error("Erro ao criar alerta:", error);
    throw error;
  }
};
