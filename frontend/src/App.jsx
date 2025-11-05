import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginCadastro from "./pages/loginCadastro";
import Home from "./pages/home";
import DashBoard from "./pages/dashBoard";
import Estoque from "./pages/Estoque";
import Pratos from "./pages/pratos";
import Vendas from "./pages/vendas";
import Financeiro from "./pages/financeiro";
import Relatorios from "./pages/relatorio";
import Historico from "./pages/historico";
import Controles from "./pages/controles";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginCadastro/>}/>

        <Route path="/home" element={<ProtectedRoute element={Home} requiredRoles={["Administrador", "Funcionario_Comum", "Financeiro_Gerente"]}/>}/>
        <Route path="/dashBoard" element={<ProtectedRoute element={DashBoard} requiredRoles={["Administrador", "Funcionario_Comum", "Financeiro_Gerente"]}/>}/>
        <Route path="/pratos" element={<ProtectedRoute element={Pratos} requiredRoles={["Administrador", "Funcionario_Comum", "Financeiro_Gerente"]}/>}/>
        <Route path="/estoque" element={<ProtectedRoute element={Estoque} requiredRoles={["Administrador", "Funcionario_Comum", "Financeiro_Gerente"]}/>}/>
        <Route path="/vendas" element={<ProtectedRoute element={Vendas} requiredRoles={["Administrador", "Funcionario_Comum", "Financeiro_Gerente"]}/>}/>
        <Route path="/financeiro" element={<ProtectedRoute element={Financeiro} requiredRoles={["Administrador", "Funcionario_Comum", "Financeiro_Gerente"]}/>}/>
        <Route path="/relatorio" element={<ProtectedRoute element={Relatorios} requiredRoles={["Administrador", "Funcionario_Comum", "Financeiro_Gerente"]}/>}/>
        <Route path="/historico" element={<ProtectedRoute element={Historico} requiredRoles={["Administrador"]}/>}/>
        <Route path="/controles" element={<ProtectedRoute element={Controles} requiredRoles={["Administrador"]}/>}/>

      </Routes>
    </Router>
  );
}

export default App;
