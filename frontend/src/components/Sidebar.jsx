import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/home.css";

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
    { label: "DashBoard", icon: dashboard, path: "/dashBoard" },
    { label: "Estoque", icon: produtos, path: "/estoque" },
    { label: "Pratos", icon: receitas, path: "/pratos"},
    { label: "Vendas", icon: vendas, path: "/vendas" },
    { label: "Financeiro", icon: financeiro, path: "/financeiro" },
    { label: "Relatorios", icon: relatorios, path: "/relatorio" },
    { label: "Historico", icon: historico, path: "/historico" },
    { label: "Usuarios", icon: usuarios, path: "/usuarios" },
];

export default function Sidebar({ activeItem, setActiveItem }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const handleLogout = () => {
        navigate("/")
    };
    const handleMenuClick = (item) => {
        setActiveItem(item.label);
        navigate(item.path);
    }

    return (
        <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
            <div className="sidebar-header">
                <div className="menu-icon" onClick={toggleSidebar}>
                    <img src={list} alt="menu" className="icon-btn" />
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <div key={item.label} className={`nav-item ${activeItem === item.label ? "active" : ""}`} onClick={() => handleMenuClick(item)}>
                        <img src={item.icon} alt={item.label} className="nav-icon" />
                        {!isSidebarCollapsed && <span className="nav-text">{item.label}</span>}
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
