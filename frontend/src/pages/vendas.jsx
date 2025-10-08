import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import "../assets/home.css";
import "../assets/lista.css"

export default function Vendas() {
  const [activeItem, setActiveItem] = useState("Vendas");
  const userName = "Nome Do Usuario";

  const [vendas, setVenda] = useState([
        { id: 1, numero: 42134, data: "data", produto: "Bolo de Cenoura", valor: 22, quantidade: 1 },
        { id: 2, numero: 5634, data: "data", produto: "Feijoada", valor: 24, quantidade: 2 },
        { id: 3, numero: 4354, data: "data", produto: "Macarrao", valor: 15, quantidade: 3},
        { id: 4, numero: 65432, data: "data", produto: "Arroz com ovo", valor: 56, quantidade: 3 },
      ]);

  return (
    <div className="home-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="main-content-area">
        <MainHeader userName={userName} />

        <main className="main-content">
          {/* <h2>{activeItem}</h2>
          <p>{activeItem}</p> */}

          <table className="table">
            <thead>
              <tr>
                <th>Numero da venda</th>
                <th>Data</th>
                <th>Produto</th>
                <th>Valor</th>
                <th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((venda) => (
                <tr key={venda.id}>
                  <td>{venda.numero}</td>
                  <td>{venda.data}</td>
                  <td>{venda.produto}</td>
                  <td>{venda.valor}</td>
                  <td>{venda.quantidade}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </main>
      </div>
    </div>
  );
}
