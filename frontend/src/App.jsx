import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginCadastro from "./pages/loginCadastro";
import Home from "./pages/home";
import DashBoard from "./pages/dashBoard"
import Produtos from "./pages/produtos"
import Receitas from "./pages/receitas"
import Vendas from "./pages/vendas"
import Financeiro from "./pages/financeiro"
import Relatorios from "./pages/relatorio"
import Historico from "./pages/historico"
import Usuarios from "./pages/usuarios"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginCadastro/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/dashBoard" element={<DashBoard/>}/>
        <Route path="/receitas" element={<Receitas/>}/>
        <Route path="/produtos" element={<Produtos/>}/>
        <Route path="/vendas" element={<Vendas/>}/>
        <Route path="/financeiro" element={<Financeiro/>}/>
        <Route path="/relatorio" element={<Relatorios/>}/>
        <Route path="/historico" element={<Historico/>}/>
        <Route path="/usuarios" element={<Usuarios/>}/>

      </Routes>
    </Router>
  );
}

export default App;
