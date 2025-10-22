import React, { useEffect, useState } from "react";
import "../assets/mainHeader.css";
import Topmenu from "../components/Topmenu";
import notificacao from "../icons/notification.png";
import usuario from "../icons/user.png";
import mensage from "../icons/mail.png";

export default function MainHeader({ area, onMenuSelect }) {
  const userName = localStorage.getItem("nome_usuario");

  return (
    <header className="main-header">
      <Topmenu area={area} onSelect={onMenuSelect} />

      <div className="user-controls">
        <div className="divider"></div>
        <img src={notificacao} alt="Notificações" className="icon-btn" />
        <img src={mensage} alt="Mensagens" className="icon-btn" />
        <div className="divider"></div>
        <span className="user-name">{userName}</span>
        <img src={usuario} alt="Usuário" className="user-avatar" />
      </div>
    </header>
  );
}
