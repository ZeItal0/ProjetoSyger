import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import "../assets/home.css";

export default function Usuarios() {
  const [activeItem, setActiveItem] = useState("Usuarios");
  const userName = "Nome Do Usuario";

  const [usuarios, setUsuario] = useState([
            { id: 1, usuario: 42134, acao: "venda adicionada", data: "data", hora: "9:45", detalhes: "registrou uma venda de um bolo de cenoura" },
            { id: 2, usuario: 5634, acao: "receita removida", data: "data", hora: "9:50", detalhes: "removeu a receita de feijoada dos registros" },
            { id: 3, usuario: 4354, acao: "produto adicionado", data: "data", hora: "9:34", detalhes: "adicionado arroz ao estoque"},
            { id: 4, usuario: 65432, acao: "gerou relatorio", data: "data", hora: "15:23", detalhes: "Relatorio diario gerado" },
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
                <th>Nome</th>
                <th>E-mail</th>
                <th>CNPJ</th>
                <th>User</th>
                <th>Data de cadastro</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.usuario}</td>
                  <td>{usuario.acao}</td>
                  <td>{usuario.data}</td>
                  <td>{usuario.hora}</td>
                  <td>{usuario.detalhes}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </main>
      </div>
    </div>
  );
}
