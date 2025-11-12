import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { salvarMensagem } from "./src/services/mensagensService.js";

let io;
const usuariosConectados = new Map();

export function inicializarSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      console.log("conexao rejeitada: token ausente");
      return next(new Error("Token ausente"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      console.log("token valido para usuario:", decoded.nome_completo);
      next();
    } catch (err) {
      console.log("token invalido");
      next(new Error("token invalido"));
    }
  });

  io.on("connection", (socket) => {
    console.log("cliente conectado:", socket.id);

    socket.on("registrarUsuario", (userId) => {
      usuariosConectados.set(userId, socket.id);
      socket.join(`usuario_${userId}`);
      console.log(`Usuário ${userId} registrado na sala usuario_${userId}`);
    });

    socket.on("enviar_mensagem", async ({ destinatario, mensagem }) => {
      const remetenteId = socket.user?.id;

      if (!remetenteId) {
        console.log("remetente nao identificado");
        return;
      }

      try {
        const mensagemSalva = await salvarMensagem({
          id_remetente: remetenteId,
          id_destinatario: destinatario === "Todos os Utilizadores Ativos" ? null : Number(destinatario),
          assunto: destinatario === "Todos os Utilizadores Ativos"
            ? "Notificação Geral"
            : "Mensagem do ADMIN",
          conteudo: mensagem,
        });

        const payload = {
          titulo: mensagemSalva.assunto,
          conteudo: mensagemSalva.conteudo,
          data: new Date(mensagemSalva.data_envio).toLocaleString(),
        };

        if (destinatario === "Todos os Utilizadores Ativos") {
          io.emit("mensagem_recebida", payload);
        } else {
          const socketId = usuariosConectados.get(destinatario);
          if (socketId) {
            io.to(socketId).emit("mensagem_recebida", payload);
            console.log(`Mensagem enviada e salva para usuário ${destinatario}`);
          } else {
            console.log(`usuario ${destinatario} nao está conectado, mas a mensagem foi salva.`);
          }
        }
      } catch (err) {
        console.error("erro ao salvar/enviar mensagem:", err);
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, id] of usuariosConectados.entries()) {
        if (id === socket.id) {
          usuariosConectados.delete(userId);
          console.log(`usuario ${userId} desconectado`);
        }
      }
    });
  });
}
