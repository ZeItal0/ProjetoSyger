import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import GlassBox from "../components/GlassBox";
import RelatorioDeVenda from "./relatorioDeVenda";
import RelatorioDeEstoque from "./relatorioDeEstoque";
import "../assets/home.css";
import "../assets/box.css";

export default function Relatorio() {
  const [activeItem, setActiveItem] = useState("Relatorio");
  const [activeTab, setActiveTab] = useState("Relatorio de Vendas");

  const renderConteudo = () => {
    switch (activeTab) {
      case "Relatorio de Vendas":
        return <RelatorioDeVenda />;
      case "Relatorio de Estoque":
        return <RelatorioDeEstoque />;
      default:
        return <p>Escolha uma das Opcões</p>;
    }
  };

  return (
    <div className="home-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="main-content-area">
        <MainHeader area="Relatorio" onMenuSelect={setActiveTab} />

          <main className="main-content">{renderConteudo()}</main>

      </div>
    </div>
  );
}
