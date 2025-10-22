import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import GlassBox from "../components/GlassBox";
import Despesas from "./despesas";
import "../assets/home.css";
import "../assets/box.css";

export default function Financeiro() {
  const [activeItem, setActiveItem] = useState("Financeiro");

  const [activeTab, setActiveTab] = useState("Despesas")

  const renderConteudo = () => {
    switch (activeTab) {
      case "Despesas":
        return <Despesas />;
      case "Gestão do Cardápio":
        return <GestaoCardapio />;
      default:
        return <p>Escolha uma das Opcões</p>;
    }
  };

  return (
    <div className="home-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="main-content-area">
        <MainHeader area="Financeiro" onMenuSelect={setActiveTab} />

        <main className="main-content">{renderConteudo()}</main>
      </div>
    </div>
  );
}
