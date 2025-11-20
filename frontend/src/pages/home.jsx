import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import "../assets/home.css";
import "../assets/Stylehome.css";
import dashAp from "../icons/dashAp.png";
import boxAp from "../icons/boxAp.png";
import clipboardAp from "../icons/clipboardAp.png";
import restaurantAp from "../icons/restaurantAp.png";
import handAp from "../icons/handAp.png";
import acquisitionAp from "../icons/acquisitionAp.png";
import girlAp from "../icons/girlAp.png";
import GlassBox from "../components/GlassBox";

const OptionCard = ({ icon, title }) => (
  <div className="option-card">
    <img src={icon} alt={title} className="card-icon" />
    <p className="card-title">{title}</p>
  </div>
);

export default function Home() {
  const [activeItem, setActiveItem] = useState("Home");

  const options = [
    { icon: dashAp, title: "DashBoard" },
    { icon: boxAp, title: "Estoque" },
    { icon: restaurantAp, title: "Receitas" },
    { icon: acquisitionAp, title: "Vendas" },
    { icon: handAp, title: "Financeiro" },
    { icon: clipboardAp, title: "Relatórios" },
  ];

  return (
    <div className="home-color">
      <div className="home-container">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <div>
          <div className="main-content-area">
          <MainHeader area="Home" />

          <main className="main-content home-page-content">

            <div className="welcome-text-container">
              <div className="welcome-header">
                <h1>Olá seja Bem vindo ao Syger</h1>
                <h2>Seu restaurante na palma da mão</h2>
              </div>

              <p className="description-text">
                No syger voce podera gerenciar seu restaurante sem nenhuma perda para seu empreendimento, tendo total controle sobre inventario, fornecedores, despesas, pratos, gestão de cardapio, e relatorios atualizados em tempo real, contando com uma dashboard informativa e um ponto de venda com opções para gerenciar mesas, marmitas e venda rapida, alem de fornecer a opção de estorno onde o produto e reestocado sem nenhum problema e os descontos dos insumos sobre a receita criada são calculados proporcionalmente sobre as porções.
              </p>

              <p className="call-to-action-text">
                Defina seu cardápio do dia e crie novas receitas o syger proporciona controle total sobre as operações do seu próprio negocio.
              </p>

              <h3 className="options-title">Opções disponíveis para seu negocio</h3>

              <div className="options-grid">
                {options.slice(0, 3).map((option) => (
                  <GlassBox key={option.title}>
                    <OptionCard icon={option.icon} title={option.title} />
                  </GlassBox>
                ))}
              </div>

              <div className="options-grid second-row">
                {options.slice(3).map((option) => (
                  <GlassBox key={option.title}>
                    <OptionCard icon={option.icon} title={option.title} />
                  </GlassBox>
                ))}
              </div>
            </div>

            <div className="welcome-image-container">
              <img src={girlAp} alt="Mulher comendo macarrão" className="welcome-image" />
            </div>

          </main>
        </div>
        </div>
        
      </div>
    </div>
  );
}
