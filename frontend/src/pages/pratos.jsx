import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import RegistrarPrato from "./registrarPrato";
import GestaoCardapio from "./gestaoCardapio";
import CardapioDoDia from "./CardapioDoDia";
import "../assets/home.css";
import "../assets/lista.css";

export default function pratos() {
  const [activeItem, setActiveItem] = useState("Pratos");

  const [activeTab, setActiveTab] = useState("Registrar Pratos")

  const renderConteudo = () => {
    switch (activeTab) {
      case "Registrar Pratos":
        return <RegistrarPrato />;
      case "Gestão do Cardápio":
        return <GestaoCardapio />;
      case "Montagem do Cardápio":
        return <CardapioDoDia />;
      default:
        return <p>Escolha uma das Opcões</p>;
    }
  };

  return (
    <div className="home-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="main-content-area">
        <MainHeader area="Pratos" onMenuSelect={setActiveTab}/>

        <main className="main-content">{renderConteudo()}</main>
      </div>
    </div>
  );
}
