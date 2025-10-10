import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import GlassBox from "../components/GlassBox";
import "../assets/home.css";
import "../assets/box.css";

export default function Financeiro() {
  const [activeItem, setActiveItem] = useState("Financeiro");
  const userName = "Nome Do Usuario";

  return (
    <div className="home-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="main-content-area">
        <MainHeader userName={userName} area="Financeiro"/>

        <main className="main-content">
          {/* <h2>{activeItem}</h2>
          <p>{activeItem}</p> */}

          <GlassBox>
            
          </GlassBox>
        </main>
      </div>
    </div>
  );
}
