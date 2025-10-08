import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import "../assets/home.css";

export default function Home() {
  const [activeItem, setActiveItem] = useState("Home");
  const userName = "Nome Do Usuario";

  return (
    <div className="home-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="main-content-area">
        <MainHeader userName={userName} />

        <main className="main-content">
          <h2>{activeItem}</h2>
          <p>{activeItem}</p>
        </main>
      </div>
    </div>
  );
}
