import { io } from "socket.io-client";

let socket = null;

export function conectarSocket(token) {
  if (socket && socket.connected) return socket;

  socket = io("http://localhost:5000", {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
    console.log("conectado ao servidor socket:", socket.id);

    const userId = localStorage.getItem("id");
    if (userId) {
      socket.emit("registrarUsuario", userId);
      console.log(`usuario ${userId} re-registrado na reconexao`);
    }
  });

  socket.on("disconnect", () => {
    console.warn("desconectado do servidor socket");
  });

  socket.on("reconnect_attempt", (attempt) => {
    console.log(`tentando reconectar${attempt}`);
  });

  socket.on("reconnect", () => {
    console.log("reconectado ao servidor com sucesso!");
  });

  socket.on("reconnect_failed", () => {
    console.error("falha ao reconectar ao servidor socket");
  });

  return socket;
}

export function getSocket() {
  if (!socket) {
    const token = localStorage.getItem("token");
    if (token) {
      return conectarSocket(token);
    }
  }
  return socket;
}
