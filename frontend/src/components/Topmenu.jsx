import React, { useState, useEffect } from "react";
import "../assets/topmenu.css";

const allMenuItems = [
  { label: "Registrar Produto", area: "Estoque", roles: ["Administrador", "Funcionario_Comum"] },
  { label: "Registrar Fornecedores", area: "Estoque", roles: ["Administrador"] },
  { label: "Inventário", area: "Estoque", roles: ["Administrador", "Funcionario_Comum"] },
  { label: "Registrar Pratos", area: "Pratos", roles: ["Administrador", "Chefe"] },
  { label: "Gestão do Cardápio", area: "Pratos", roles: ["Administrador"] },
  { label: "Montagem do Cardápio", area: "Pratos", roles: ["Administrador", "Chefe"] },
  { label: "Venda Rapida", area: "Vendas", roles: ["Administrador", "Vendedor"] },
  { label: "Estorno", area: "Vendas", roles: ["Administrador", "Vendedor"] },
  { label: "Relatorio de Vendas", area: "Relatorio", roles: ["Administrador", "Gerente"] },
  { label: "Relatorio de Estoque", area: "Relatorio", roles: ["Administrador", "Gerente"] },
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
          <button key={index} className={`menu-btn ${activeIndex === index ? "active" : ""}`} onClick={() => handleClick(index, item.label)}>{item.label}</button>
        ))}
      </div>

    </nav>
  );
}
