import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import GlassBox from "../components/GlassBox";
import Calendar from "react-calendar"; // Import do Calendar
import "react-calendar/dist/Calendar.css"; // CSS do Calendar
import "../assets/home.css";
import "../assets/box.css";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart, // Import para gráficos de pizza
  Pie, // Import para gráficos de pizza
  Cell // Import para gráficos de pizza
} from "recharts";

// Dados para os gráficos da área de Relatório (MOVEMOS ESTES DADOS)
const vendasHoje = [
  { name: "Produto A", value: 400 },
  { name: "Produto B", value: 300 },
  { name: "Produto C", value: 300 },
];

const vendasOntem = [
  { name: "Produto A", value: 200 },
  { name: "Produto B", value: 500 },
  { name: "Produto C", value: 100 },
];

const meses = [
  { name: "jan", vendas: 200 },
  { name: "fev", vendas: 400 },
  { name: "mar", vendas: 300 },
  { name: "abr", vendas: 100 },
  { name: "mai", vendas: 200 },
  { name: "jun", vendas: 250 },
];

const COLORS = ["#264653", "#2A9D8F", "#E9C46A"]; // Cores dos gráficos de pizza

// Dados já existentes no Dashboard
const vendasData = [
  { mes: "Jan", valor: 4000 },
  { mes: "Fev", valor: 3000 },
  { mes: "Mar", valor: 5000 },
  { mes: "Abr", valor: 7000 },
  { mes: "Mai", valor: 6000 },
];

const receitasDespesasData = [
  { mes: "Jan", receita: 4000, despesa: 2400 },
  { mes: "Fev", receita: 3000, despesa: 1398 },
  { mes: "Mar", receita: 5000, despesa: 2400 },
  { mes: "Abr", receita: 7000, despesa: 4000 },
  { mes: "Mai", receita: 6000, despesa: 2500 },
];

export default function Dashboard() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [date, setDate] = useState(new Date());
  const userName = "Nome Do Usuario";

  return (
    <div className="home-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="main-content-area">
        <MainHeader userName={userName} />

        <main className="main-content dashboard-container">

          
          <div className="metrics-row">
            <GlassBox>
              <h3>Total de Vendas</h3>
              <p className="metric-value">R$ 24.500</p>
            </GlassBox>

            <GlassBox>
              <h3>Lucro do Mês</h3>
              <p className="metric-value">R$ 8.230</p>
            </GlassBox>

            <GlassBox>
              <h3>Produtos Cadastrados</h3>
              <p className="metric-value">128</p>
            </GlassBox>

            <GlassBox>
              <h3>Produtos retirados</h3>
              <p className="metric-value">35</p>
            </GlassBox>
          </div>


          <div className="charts-grid dashboard-charts-extanded">

            
            <GlassBox>
              <h3>Vendas por Mês</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={vendasData}>
                  <Line type="monotone" dataKey="valor" stroke="#f09410" strokeWidth={2} />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </GlassBox>

            <GlassBox>
              <h3>Receitas e Despesas</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={receitasDespesasData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="receita" fill="#f09410" />
                  <Bar dataKey="despesa" fill="#6a1a7f" />
                </BarChart>
              </ResponsiveContainer>
            </GlassBox>

            <GlassBox>
              <h3 className="grafico-titulo">Dia anterior</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={vendasOntem} cx="50%" cy="50%" outerRadius={100} dataKey="value" labelLine={false}>
                    {vendasOntem.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </GlassBox>

            
            <GlassBox >
              <h3 className="grafico-titulo">Dia atual</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={vendasHoje} cx="50%" cy="50%" outerRadius={100} dataKey="value" labelLine={false}>
                    {vendasHoje.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </GlassBox>

            
            <GlassBox>
              <h3 className="grafico-titulo">Calendário</h3>
              <div className="calendar-container">
                <Calendar onChange={setDate} value={date} className="custom-calendar" />
              </div>
            </GlassBox>

          </div>
        </main>
      </div>
    </div>
  );
}