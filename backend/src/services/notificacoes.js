import { getSocket, getUsuariosConectados } from "../../socketServer.js";

export async function enviarNotificacaoUsuario({ id_usuario, titulo, conteudo }) {
  const io = getSocket();
  const usuarios = getUsuariosConectados();

  if (!io) return;

  const socketId = usuarios.get(Number(id_usuario));

  if (socketId) {
    io.to(socketId).emit("nova_notificacao", {
      titulo,
      conteudo,
      data: new Date().toLocaleString(),
    });

    console.log(`Notificação enviada ao usuário ${id_usuario}`);
  } else {
    console.log(`Usuário ${id_usuario} não está conectado`);
  }
}
