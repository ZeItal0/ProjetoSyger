import React, { useState, useEffect } from "react";
import "../assets/topmenu.css";

const allMenuItems = [
  { label: "Registrar Produto", area: "Estoque", roles: ["Administrador", "Funcionario_Comum"] },
  { label: "Registrar Fornecedores", area: "Estoque", roles: ["Administrador", "Funcionario_Comum"] },
  { label: "Inventário", area: "Estoque", roles: ["Administrador", "Funcionario_Comum"] },
  { label: "Registrar Pratos", area: "Pratos", roles: ["Administrador", "Funcionario_Comum"] },
  { label: "Gestão do Cardápio", area: "Pratos", roles: ["Administrador", "Funcionario_Comum"] },
  { label: "Montagem do Cardápio", area: "Pratos", roles: ["Administrador", "Funcionario_Comum"] },
  { label: "Venda Rapida", area: "Vendas", roles: ["Administrador", "Funcionario_Comum"] },
  { label: "Estorno", area: "Vendas", roles: ["Administrador", "Funcionario_Comum"] },
  { label: "Relatorio de Vendas", area: "Relatorio", roles: ["Administrador", "Funcionario_Comum"] },
  { label: "Relatorio de Estoque", area: "Relatorio", roles: ["Administrador", "Funcionario_Comum"] },
];


export default function Topmenu({ area = "Estoque", onSelect }) {
  const userRole = localStorage.getItem("nivel_acesso");
  const filteredItems = allMenuItems.filter(
    (item) => item.area === area && item.roles.includes(userRole)
  );
  
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    console.log("Área atual:", area, "Itens renderizados:", filteredItems);
  }, [area]);

  const handleClick = (index, label) => {
    setActiveIndex(index);
    if (onSelect) onSelect(label);
  };

  return (

    <nav className="topmenu" aria-label="top menu">
      <div className="menu-left">
        {filteredItems.map((item, index) => (
          <button key={index} className={`menu-btn-top ${activeIndex === index ? "active" : ""}`} onClick={() => handleClick(index, item.label)}>{item.label}</button>
        ))}
      </div>

    </nav>
  );
}
