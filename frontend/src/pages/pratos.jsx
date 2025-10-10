import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import "../assets/home.css";
import "../assets/lista.css"

export default function pratos() {
  const [activeItem, setActiveItem] = useState("Pratos");
  const userName = "Nome Do Usuario";

  const [receitas, setReceita] = useState([
      { id: 1, nome: "Feijoada", custo: 30.00, atualizado: "data", quantidade: 2, estoqueMinimo: 10 },
      { id: 2, nome: "Arroz com ovo", custo: 15.50, atualizado: "data", quantidade: 2, estoqueMinimo: 5 },
      { id: 3, nome: "Bolo de Cenoura", custo: 7.50, atualizado: "data", quantidade: 20, estoqueMinimo: 5 },
      { id: 4, nome: "Macarrão", custo: 10.00, atualizado: "data", quantidade: 3, estoqueMinimo: 3 },
    ]);

  return (
    <div className="home-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="main-content-area">
        <MainHeader userName={userName} area="Pratos" />

        <main className="main-content">
          {/* <h2>{activeItem}</h2>
          <p>{activeItem}</p> */}

          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Custo</th>
                <th>Atualizado</th>
                <th>Quantidade</th>
                <th>Estoque Mínimo</th>
              </tr>
            </thead>
            <tbody>
              {receitas.map((receita) => (
                <tr key={receita.id}>
                  <td>{receita.nome}</td>
                  <td>{receita.custo}</td>
                  <td>{receita.atualizado}</td>
                  <td>{receita.quantidade}</td>
                  <td>{receita.estoqueMinimo}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </main>
      </div>
    </div>
  );
}
