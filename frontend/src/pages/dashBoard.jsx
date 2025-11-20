import React from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import GlassBox from "../components/GlassBox";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../assets/home.css";
import "../assets/box.css";
import { useDashboard } from "../api/useDashBoard";

import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#264653", "#2A9D8F", "#E9C46A", "#FF8E71", "#FF5757"];

export default function Dashboard() {

  const {
    activeItem, setActiveItem,
    date, setDate,
    range,
    loading,
    error,
    totalVendas,
    lucro,
    totalEntrada,
    totalSaida,
    vendasPorMes,
    receitasDespesas
  } = useDashboard();

  const formatDate = (d) => {
    const dt = new Date(d);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="home-container">

      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="main-content-area">
        <MainHeader area="DashBoard" />
        <main className="main-content dashboard-container">

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Visão: {formatDate(range.start)} → {formatDate(range.end)}</h2>
          </div>

          {loading && <p>Carregando dados</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="metrics-row">
            <GlassBox>
              <h3>Total de Vendas</h3>
              <p className="metric-value">
                R$ {totalVendas.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </GlassBox>

            <GlassBox>
              <h3>Lucro do Período</h3>
              <p className="metric-value">
                R$ {lucro.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </GlassBox>

            <GlassBox>
              <h3>Entrada de Produtos</h3>
              <p className="metric-value">{totalEntrada}</p>
            </GlassBox>

            <GlassBox>
              <h3>Saída de Produtos</h3>
              <p className="metric-value">{totalSaida}</p>
            </GlassBox>
          </div>

          <div className="charts-grid dashboard-charts-extanded">

            <GlassBox>
              <h3>Vendas por Mês</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={vendasPorMes}>
                  <Line type="monotone" dataKey="valor" stroke="#FF8E71" strokeWidth={2} />
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
                <BarChart data={receitasDespesas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="receita" fill="#FF8E71" />
                  <Bar dataKey="despesa" fill="#FF5757" />
                </BarChart>
              </ResponsiveContainer>
            </GlassBox>

            <GlassBox>
              <h3 className="grafico-titulo">Resumo Geral</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Vendas (R$)", value: totalVendas },
                      { name: "Despesas (R$)", value: receitasDespesas.reduce((s, r) => s + Number(r.despesa || 0), 0) },
                      { name: "Entradas (Registros)", value: totalEntrada },
                      { name: "Saídas (Registros)", value: totalSaida },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
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