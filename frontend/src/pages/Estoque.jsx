import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import "../assets/home.css";
import "../assets/lista.css"

export default function Estoque() {
  const [activeItem, setActiveItem] = useState("Estoque");
  const userName = "Nome Do Usuario";

  const [produtos, setProdutos] = useState([
    { id: 1, nome: "Arroz", categoria: "Alimentos", unidade: "Kg", quantidade: 50, estoqueMinimo: 10 },
    { id: 2, nome: "Feijão", categoria: "Alimentos", unidade: "Kg", quantidade: 30, estoqueMinimo: 5 },
    { id: 3, nome: "Óleo", categoria: "Bebidas", unidade: "L", quantidade: 20, estoqueMinimo: 5 },
    { id: 4, nome: "Cenoura", categoria: "Hortifruti", unidade: "Kg", quantidade: 15, estoqueMinimo: 3 },
  ]);

  return (
    <div className="home-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="main-content-area">
        <MainHeader userName={userName} area="Estoque"/>

        <main className="main-content">
          {/* <h2>{activeItem}</h2>
          <p>{activeItem}</p> */}

          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Unidade</th>
                <th>Quantidade</th>
                <th>Estoque Mínimo</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>{produto.categoria}</td>
                  <td>{produto.unidade}</td>
                  <td>{produto.quantidade}</td>
                  <td>{produto.estoqueMinimo}</td>
                </tr>
              ))}
            </tbody>
          </table>


        </main>
      </div>
    </div>
  );
}
