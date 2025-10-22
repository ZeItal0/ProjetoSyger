import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import VendaRapida from "./vendaRapida";
import Estorno from "./estorno";
import "../assets/home.css";
import "../assets/lista.css"

export default function Vendas() {
  const [activeItem, setActiveItem] = useState("Vendas");

  const [activeTab, setActiveTab] = useState("Venda Rapida")

  const userName = "Nome Do Usuario";

  const renderConteudo = () => {
    switch (activeTab) {
      case "Venda Rapida":
        return <VendaRapida />;
      case "Estorno":
        return <Estorno />;
      default:
        return <p>Escolha uma das Opcões</p>;
    }
  };

  return (
    <div className="home-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="main-content-area">
        <MainHeader userName={userName} area="Vendas" onMenuSelect={setActiveTab}/>

        <main className="main-content">{renderConteudo()}</main>
      </div>
    </div>
  );
}
