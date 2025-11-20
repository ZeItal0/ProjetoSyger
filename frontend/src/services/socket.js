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
    const userId = localStorage.getItem("id");
    if (userId) {
      socket.emit("registrarUsuario", userId);
    }
  });

  socket.on("disconnect", () => {
    
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
