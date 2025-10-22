import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import "../assets/home.css";

export default function Usuarios() {
  const [activeItem, setActiveItem] = useState("Usuarios");

  const [usuarios, setUsuario] = useState([
    { id: 1, Nome: 'João Silva', Email: 'joao.s@email.com', cnpj: 'Gerente', data: '2024-05-10'},
    { id: 2, Nome: 'Maria Souza', Email: 'maria.s@email.com', cnpj: 'Cozinheira Chefe', data: '2024-06-15'},
    { id: 3, Nome: 'Pedro Lima', Email: 'pedro.l@email.com', cnpj: 'Atendente',data: '2024-08-01'},
    { id: 4, Nome: 'Ana Costa', Email: 'ana.c@email.com', cnpj: 'Caixa', data: '2024-07-20' }
]);

  return (
    <div className="home-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="main-content-area">
        <MainHeader area="Usuarios"/>

        <main className="main-content">

          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>CNPJ</th>
                <th>Numero do usuario</th>
                <th>Data de cadastro</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.Nome}</td>
                  <td>{usuario.Email}</td>
                  <td>{usuario.cnpj}</td>
                  <td>{usuario.id}</td>
                  <td>{usuario.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </main>
      </div>
    </div>
  );
}
