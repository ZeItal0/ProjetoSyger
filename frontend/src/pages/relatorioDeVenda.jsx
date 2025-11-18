import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../assets/relatoriosDeVenda.css";
import PDF from "../icons/pdf.png";
import Email from "../icons/email.png";
import { useRelatorioVendas } from "../api/useRelatorioVendas";

export default function RelatoriosDeVendas() {
   const {
    filtroPagamento, setFiltroPagamento,
    filtroTipoVenda, setFiltroTipoVenda,
    filtroPeriodo, setFiltroPeriodo,
    filtroDataEspecifica, setFiltroDataEspecifica,
    diaSelecionado, setDiaSelecionado,
    modoComparacao, setModoComparacao,
    filtroDataInicioComparacao, setFiltroDataInicioComparacao,
    filtroDataFimComparacao, setFiltroDataFimComparacao,
    pedidos, resumo, top10,
    gerarPDF, enviarEmail,
  } = useRelatorioVendas();
    return (
        <div className="relatorios-vendas-container">
            <h1>Relatórios de Vendas</h1>
            <div className="conteudo-principal">
                <div className="coluna-esquerda">
                    <h2>Filtros</h2>

                    <div className="filtro-grupo">
                        <select value={filtroPagamento} onChange={(e) => setFiltroPagamento(e.target.value)}>
                            <option value="">Tipo de Pagamento</option>
                            <option value="Dinheiro">Dinheiro</option>
                            <option value="Cartao">Cartão</option>
                            <option value="Pix">PIX</option>
                        </select>
                    </div>

                    <div className="filtro-grupo">
                        <select value={filtroTipoVenda} onChange={(e) => setFiltroTipoVenda(e.target.value)}>
                            <option value="">Tipo de Venda</option>
                            <option value="Mesa">Mesa</option>
                            <option value="Marmita">Marmita</option>
                            <option value="Venda_Rapida">Venda Rápida</option>
                        </select>
                    </div>

                    <div className="filtro-grupo">
                        <select value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value)}>
                            <option value="">Período</option>
                            <option value="dia">Dia</option>
                            <option value="mes">Mês</option>
                            <option value="ano">Ano</option>
                        </select>
                    </div>

                    <div className="filtro-grupo">
                        <input type="date" value={filtroDataEspecifica} onChange={(e) => setFiltroDataEspecifica(e.target.value)} />
                    </div>

                    <button className="btn-comparacao" onClick={() => setModoComparacao(!modoComparacao)}>Comparar com Outro Período </button>

                    {modoComparacao && (
                        <div className="comparacao-section">
                            <h3>Período de Comparação</h3>
                            <div className="filtro-grupo">
                                <label>Data Início:</label>
                                <input type="date" value={filtroDataInicioComparacao} onChange={(e) => setFiltroDataInicioComparacao(e.target.value)} />
                            </div>
                            <div className="filtro-grupo">
                                <label>Data Fim:</label>
                                <input type="date" value={filtroDataFimComparacao} onChange={(e) => setFiltroDataFimComparacao(e.target.value)} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="coluna-direita">
                    <h2 className="calendario-titulo">Calendário</h2>
                    <div className="calendario-container">
                        <Calendar onChange={(data) => { setDiaSelecionado(data); setFiltroDataEspecifica(data.toISOString().split("T")[0]);}}
                            value={diaSelecionado}
                            locale="pt-BR"
                            nextLabel=">"
                            prevLabel="<"
                            calendarType="gregory"
                        />
                    </div>

                    <div className="botoes-exportar">
                        <button className="botao-exportar" onClick={gerarPDF}><img src={PDF} alt="pdf-img" /> Exportar PDF</button>

                        <button className="botao-email" onClick={enviarEmail}><img src={Email} alt="Email-img" /> Enviar por E-mail</button>
                    </div>
                </div>
            </div>

            <div className="resumo-section">
                <h2>Resumo de Vendas</h2>
                <div className="cards-resumo">
                    <div className="card-resumo">
                        <p className="card-label">Total Bruto</p>
                        <p className="card-valor">R$ {resumo.totalBruto?.toFixed(2)}</p>
                    </div>
                    <div className="card-resumo">
                        <p className="card-label">Total Líquido</p>
                        <p className="card-valor">R$ {resumo.totalLiquido?.toFixed(2)}</p>
                    </div>
                    <div className="card-resumo">
                        <p className="card-label">Descontos</p>
                        <p className="card-valor">R$ {resumo.totalDescontos?.toFixed(2)}</p>
                    </div>
                    <div className="card-resumo">
                        <p className="card-label">Quantidade</p>
                        <p className="card-valor">{resumo.quantidadeVendas}</p>
                    </div>
                    <div className="card-resumo">
                        <p className="card-label">Ticket Médio</p>
                        <p className="card-valor">R$ {resumo.ticketMedio?.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="top10-section">
                <h2>Top 10 Pratos Mais Vendidos</h2>
                <div className="tabela-container">
                    <table className="tabela-top10">
                        <thead>
                            <tr>
                                <th>POSIÇÃO</th>
                                <th>PRODUTO</th>
                                <th>QUANTIDADE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {top10.length > 0 ? (
                                top10.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.produto}</td>
                                        <td>{item.quantidade}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3}>Nenhum dado encontrado</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
