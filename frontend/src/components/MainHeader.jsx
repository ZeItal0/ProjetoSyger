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
  const [notificacoes, setNotificacoes] = useState([]);
  const [temNovaMensagem, setTemNovaMensagem] = useState(false);
  const [temNovaNotificacao, setTemNovaNotificacao] = useState(false);
  const [mostrarPopupMensagens, setMostrarPopupMensagens] = useState(false);
  const [mostrarPopupNotificacoes, setMostrarPopupNotificacoes] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    if (userId) socket.emit("registrarUsuario", userId);

    const handleMensagem = (msg) => {
      setMensagens((prev) => [...prev, { ...msg, tipo: "mensagem" }]);
      setTemNovaMensagem(true);
    };

    const handleEstoqueBaixo = (notificacao) => {
      setNotificacoes((prev) => [...prev, { ...notificacao, tipo: "estoque" }]);
      setTemNovaNotificacao(true);
    };

    const handleNovaNotificacao = (notificacao) => {
    setNotificacoes((prev) => [...prev, { ...notificacao, tipo: "usuario" }]);
    setTemNovaNotificacao(true);
  };

    socket.on("mensagem_recebida", handleMensagem);
    socket.on("notificacao_estoque", handleEstoqueBaixo);
    socket.on("nova_notificacao", handleNovaNotificacao);
    return () => {
      socket.off("mensagem_recebida", handleMensagem);
      socket.off("notificacao_estoque", handleEstoqueBaixo);
      socket.off("nova_notificacao", handleNovaNotificacao);
    };
  }, [userId]);

  const togglePopupMensagens = () => {
    setMostrarPopupMensagens((prev) => !prev);
    setTemNovaMensagem(false);
  };

  const togglePopupNotificacoes = () => {
    setMostrarPopupNotificacoes((prev) => !prev);
    setTemNovaNotificacao(false);
  };



  return (
    <header className="main-header">
      <Topmenu area={area} onSelect={onMenuSelect} />

      <div className="user-controls">
        <div className="divider"></div>

        <div
          className={`msg-icon-container ${temNovaMensagem ? "pulse glow repeat" : ""
            }`}
          onClick={togglePopupMensagens}
        >
          <img src={mensage} alt="Mensagens" className="icon-btn" />
          {temNovaMensagem && <img src={circle} className="msg-badge" />}
        </div>

        <div
          className={`notification-icon-container ${temNovaNotificacao ? "iphone-alert repeat" : ""
            }`}
          onClick={togglePopupNotificacoes}
        >
          <img src={notificacao} alt="Notificações" className="icon-btn" />
          {temNovaNotificacao && <img src={circle} className="msg-badge" />}
        </div>


        <div className="divider"></div>
        <span className="user-name">{userName}</span>
        <img src={usuario} alt="Usuário" className="user-avatar" />
      </div>

      {mostrarPopupNotificacoes && (
        <div className="mensagem-popup">
          <h4>Notificações</h4>
          {notificacoes.length === 0 ? (
            <p>Nenhuma notificação</p>
          ) : (
            notificacoes.map((msg, i) => (
              <div key={i} className="mensagem-item estoque-baixo">
                <strong>{msg.titulo}</strong>
                <p><img />{msg.conteudo}</p>
              </div>
            ))
          )}
        </div>
      )}

      {mostrarPopupMensagens && (
        <div className="mensagem-popup">
          <h4>Mensagens</h4>
          {mensagens.length === 0 ? (
            <p>Nenhuma mensagem recebida</p>
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
