import React, { useState, useEffect } from "react";
import "../assets/topmenu.css";

const allMenuItems = [
  { label: "Registrar Produto", area: "Estoque" },
  { label: "Registrar Fornecedores", area: "Estoque" },
  { label: "Inventário", area: "Estoque" },
  { label: "Registro de Pratos", area: "Pratos" },
  { label: "Cardápio", area: "Pratos" }
];

export default function Topmenu({ area = "Estoque" }) {
  const filteredItems = allMenuItems.filter(item => item.area === area);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    console.log("Área atual:", area, "Itens renderizados:", filteredItems);
  }, [area]);

  return (
    <nav className="topmenu" aria-label="top menu">
      <div className="menu-left">
        {filteredItems.map((item, index) => (
          <button
            key={index}
            className={`menu-btn ${activeIndex === index ? "active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
