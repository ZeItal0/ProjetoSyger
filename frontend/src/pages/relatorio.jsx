import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import GlassBox from "../components/GlassBox";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../assets/home.css";
import "../assets/box.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

export default function Relatorio() {
  const [activeItem, setActiveItem] = useState("Relatorio");
  const [date, setDate] = useState(new Date());
  const userName = "Nome Do Usuario";

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

  const COLORS = ["#264653", "#2A9D8F", "#E9C46A"];

  return (
    <div className="home-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="main-content-area">
        <MainHeader userName={userName} />

        <main className="main-content relatorio-grid">

          <GlassBox title="Dia anterior">
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

          <GlassBox title="Dia atual">
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


          <GlassBox title="Últimos meses">
            <h3 className="grafico-titulo">ultimos meses</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={meses}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vendas" fill="#264653" />
              </BarChart>
            </ResponsiveContainer>
          </GlassBox>


          <div className="export-buttons">
            <button className="export-btn">Exportar PDF</button>
            <button className="export-btn">Exportar Email</button>
          </div>

        </main>
      </div>
    </div>
  );
}
