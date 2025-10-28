import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import RegistrarProduto from "./registrarProduto";
import RegistrarFornecedores from "./registrarFornecedores";
import Inventario from "./inventario";

export default function Estoque() {
  const [activeItem, setActiveItem] = useState("Estoque");
  const [activeTab, setActiveTab] = useState("Registrar Produto");

  const renderConteudo = () => {
    switch (activeTab) {
      case "Registrar Produto":
        return <RegistrarProduto />;
      case "Registrar Fornecedores":
        return <RegistrarFornecedores />;
      case "Inventário":
        return <Inventario />;
      default:
        return <p>Opcoes disponiveis para cliente</p>;
    }
  };

  return (
    <div className="home-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="main-content-area">
        <MainHeader area="Estoque" onMenuSelect={setActiveTab} />
        <main className="main-content">{renderConteudo()}</main>
      </div>
    </div>
  );
}
