import React, { useEffect, useState } from "react";
import "../assets/mainHeader.css";
import Topmenu from "../components/Topmenu";
import notificacao from "../icons/notification.png";
import usuario from "../icons/user.png";
import mensage from "../icons/mail.png";
import circle from "../icons/circle.png";
import { getSocket } from "../services/socket";

export default function MainHeader({ area, onMenuSelect }) {
  const userName = localStorage.getItem("nome_usuario");
  const userId = localStorage.getItem("id");

  const [mensagens, setMensagens] = useState([]);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [temNovaMensagem, setTemNovaMensagem] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    if (userId) {
      socket.emit("registrarUsuario", userId);
    }
    const handleMensagem = (msg) => {
      setMensagens((prev) => [...prev, msg]);
      setTemNovaMensagem(true);
    };
    socket.on("mensagem_recebida", handleMensagem);
    return () => {
      socket.off("mensagem_recebida", handleMensagem);
    };
  }, []);


  const togglePopup = () => {
    setMostrarPopup(!mostrarPopup);
    if (!mostrarPopup) setTemNovaMensagem(false);
  };

  return (
    <header className="main-header">
      <Topmenu area={area} onSelect={onMenuSelect} />

      <div className="user-controls">
        <div className="divider"></div>
        <img src={notificacao} alt="Notificações" className="icon-btn" />

        <div className="msg-icon-container" onClick={togglePopup}>
          <img src={mensage} alt="Mensagens" className="icon-btn" />
          {temNovaMensagem && <img src={circle} className="msg-badge" />}
        </div>
        <div className="divider"></div>
        <span className="user-name">{userName}</span>
        <img src={usuario} alt="Usuário" className="user-avatar" />
      </div>

      {mostrarPopup && (
        <div className="mensagem-popup">
          <h4>Mensagens</h4>
          {mensagens.length === 0 ? (
            <p>Nenhuma mensagem recebida.</p>
          ) : (
            mensagens.map((msg, i) => (
              <div key={i} className="mensagem-item">
                <strong>{msg.titulo}</strong>
                <p>{msg.conteudo}</p>
              </div>
            ))
          )}
        </div>
      )}
    </header>
  );
}
