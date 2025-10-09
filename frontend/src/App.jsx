import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginCadastro from "./pages/loginCadastro";
import Home from "./pages/home";
import DashBoard from "./pages/dashBoard"
import Estoque from "./pages/estoque"
import Pratos from "./pages/pratos"
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
        <Route path="/pratos" element={<Pratos/>}/>
        <Route path="/estoque" element={<Estoque/>}/>
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
