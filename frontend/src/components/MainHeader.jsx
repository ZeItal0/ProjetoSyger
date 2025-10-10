import React from "react";
import "../assets/home.css";
import TopMenu from "../components/Topmenu";

import notificacao from "../icons/notification.png";
import usuario from "../icons/user.png";
import mensage from "../icons/mail.png";

export default function MainHeader({ userName, area }) {
  return (
    <header className="main-header">
      <TopMenu area={area} />

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
