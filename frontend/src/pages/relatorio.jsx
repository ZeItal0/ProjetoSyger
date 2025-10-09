import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import GlassBox from "../components/GlassBox";
import "react-calendar/dist/Calendar.css";
import "../assets/home.css";
import "../assets/box.css";

export default function Relatorio() {
  const [activeItem, setActiveItem] = useState("Relatorio");
  const userName = "Nome Do Usuario";


  return (
    <div className="home-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="main-content-area">
        <MainHeader userName={userName} />

        <main className="main-content relatorio-grid">
          <div className="export-buttons">
            <button className="export-btn">Exportar PDF</button>
            <button className="export-btn">Exportar Email</button>
          </div>

        </main>
      </div>
    </div>
  );
}
