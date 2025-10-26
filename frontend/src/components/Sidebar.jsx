import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/sidebar.css";
import list from "../icons/list.png";
import produtos from "../icons/box.png";
import receitas from "../icons/food.png";
import vendas from "../icons/growth.png";
import financeiro from "../icons/income.png";
import relatorios from "../icons/report.png";
import dashboard from "../icons/dashboard.png";
import historico from "../icons/history.png";
import usuarios from "../icons/group.png";
import sair from "../icons/logout.png";

const menuItems = [
  { label: "DashBoard", icon: dashboard, path: "/dashboard", roles: ["Administrador", "Funcionario_Comum", "Financeiro_Gerente"] },
  { label: "Estoque", icon: produtos, path: "/estoque", roles: ["Administrador", "Funcionario_Comum"] },
  { label: "Pratos", icon: receitas, path: "/pratos", roles: ["Administrador", "Funcionario_Comum"] },
  { label: "Vendas", icon: vendas, path: "/vendas", roles: ["Administrador", "Funcionario_Comum"] },
  { label: "Financeiro", icon: financeiro, path: "/financeiro", roles: ["Administrador", "Funcionario_Comum", "Financeiro_Gerente"] },
  { label: "Relatorios", icon: relatorios, path: "/relatorio", roles: ["Administrador", "Funcionario_Comum", "Financeiro_Gerente"] },
  { label: "Historico", icon: historico, path: "/historico", roles: ["Administrador"] },
  { label: "Usuarios", icon: usuarios, path: "/usuarios", roles: ["Administrador"] },
];

export default function Sidebar({ activeItem, setActiveItem }) {
  const navigate = useNavigate();
  const location = useLocation();
  const nivelAcesso = localStorage.getItem("nivel_acesso");

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    return savedState === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const current = menuItems.find((item) => item.path === location.pathname);
    if (current) setActiveItem(current.label);
  }, [location.pathname, setActiveItem]);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nivel_acesso");
    navigate("/");
  };
  const handleMenuClick = (item) => {
    setActiveItem(item.label);
    navigate(item.path);
  };

  const filteredMenu = menuItems.filter(item => item.roles.includes(nivelAcesso));

  return (
    <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="menu-icon" onClick={toggleSidebar}>
          <img src={list} alt="menu" className="icon-btn" />
        </div>
      </div>

      <nav className="sidebar-nav">
        {filteredMenu.map((item) => (
          <div key={item.label} className={`nav-item ${activeItem === item.label ? "active" : ""}`} onClick={() => handleMenuClick(item)}>
            <img src={item.icon} alt={item.label} className="nav-icon" />
            {!isSidebarCollapsed && (<span className="nav-text">{item.label}</span>)}
          </div>
        ))}
      </nav>

      <div className="siderbar-footer">
        {!isSidebarCollapsed && (
          <button className="logout-btn" onClick={handleLogout}>Sair</button>
        )}
        <img src={sair} alt="Sair" className="icon-btn" onClick={handleLogout} />
      </div>
    </div>
  );
}
