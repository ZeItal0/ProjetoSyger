import React, { useState } from "react";
import "../assets/relatorioDeEstoque.css";
import PDF from "../icons/pdf.png";

export default function RelatorioDeEstoque() {
    const [filtroFornecedor, setFiltroFornecedor] = useState("");
    const [filtroNivelEstoque, setFiltroNivelEstoque] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [filtroStatusValidade, setFiltroStatusValidade] = useState("");
    const [filtroPesquisa, setFiltroPesquisa] = useState("");

    const [itensEstoque] = useState([
        {
            id: 1,
            nome: "Arroz Branco",
            fornecedor: "Fornecedor A",
            categoria: "Grãos",
            quantidade: 29,
            minimo: 20,
            unidade: "kg",
            custoTotal: 150.0,
            validade: "2025-10-19",
            ultimaAcao: "Saída",
            dataUltMovimento: "2025-03-10",
        },
        {
            id: 2,
            nome: "Feijão Preto",
            fornecedor: "Fornecedor B",
            categoria: "Grãos",
            quantidade: 48,
            minimo: 30,
            unidade: "kg",
            custoTotal: 240.0,
            validade: "2025-06-20",
            ultimaAcao: "Entrada",
            dataUltMovimento: "2025-03-08",
        },
        {
            id: 3,
            nome: "Óleo de Soja",
            fornecedor: "Fornecedor C",
            categoria: "Óleos",
            quantidade: 8,
            minimo: 10,
            unidade: "L",
            custoTotal: 80.0,
            validade: "2025-04-05",
            ultimaAcao: "Saída",
            dataUltMovimento: "2025-03-12",
        },
        {
            id: 4,
            nome: "Sal Refinado",
            fornecedor: "Fornecedor A",
            categoria: "Temperos",
            quantidade: 25,
            minimo: 15,
            unidade: "kg",
            custoTotal: 50.0,
            validade: "2026-01-10",
            ultimaAcao: "Entrada",
            dataUltMovimento: "2025-03-05",
        },
        
    ]);

    const getStatusEstoque = (quantidade, minimo) => {
        if (quantidade < minimo) return "abaixo";
        else if (quantidade >= minimo && quantidade < minimo * 1.5) return "ok";
        else return "excesso";
    };

    const getStatusValidade = (dataValidade) => {
        const hoje = new Date();
        const validade = new Date(dataValidade);
        const diasRestantes = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));

        if (diasRestantes < 0) return "vencido";
        else if (diasRestantes <= 30) return "proximo";
        else return "normal";
    };

    const itensFiltrados = itensEstoque.filter((item) => {
        if (filtroFornecedor && item.fornecedor !== filtroFornecedor) return false;

        if (filtroNivelEstoque) {
            const status = getStatusEstoque(item.quantidade, item.minimo);
            if (filtroNivelEstoque !== status) return false;
        }

        if (filtroCategoria && item.categoria !== filtroCategoria) return false;

        if (filtroStatusValidade) {
            const status = getStatusValidade(item.validade);
            if (filtroStatusValidade !== status) return false;
        }

        if (filtroPesquisa && !item.nome.toLowerCase().includes(filtroPesquisa.toLowerCase()))
            return false;

        return true;
    });

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleDateString("pt-BR");
    };

    const handleExportarInventarioCompleto = () => {
        alert("Funcionalidade de exportar inventário completo em PDF será implementada.");
    };

    const handleExportarRelatorioReposicao = () => {
        alert("Funcionalidade de exportar relatório de reposição em PDF será implementada.");
    };

    return (
        <div className="relatorio-estoque-container">
            <h1>Relatório de Estoque</h1>

            <div className="filtros-section">
                <h2>Filtros</h2>
                <div className="filtros-grid">
                    <select value={filtroFornecedor} onChange={(e) => setFiltroFornecedor(e.target.value)}>
                        <option value="">Por Fornecedor</option>
                        <option value="Fornecedor A">Fornecedor A</option>
                        <option value="Fornecedor B">Fornecedor B</option>
                        <option value="Fornecedor C">Fornecedor C</option>
                    </select>

                    <select value={filtroNivelEstoque} onChange={(e) => setFiltroNivelEstoque(e.target.value)}>
                        <option value="">Por Nível de Estoque</option>
                        <option value="abaixo">Abaixo do Mínimo</option>
                        <option value="ok">Ok</option>
                        <option value="excesso">Excesso</option>
                    </select>

                    <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                        <option value="">Por Categoria</option>
                        <option value="Grãos">Grãos</option>
                        <option value="Óleos">Óleos</option>
                        <option value="Temperos">Temperos</option>
                    </select>

                    <select value={filtroStatusValidade} onChange={(e) => setFiltroStatusValidade(e.target.value)}>
                        <option value="">Por Status de Validade</option>
                        <option value="vencido">Vencido</option>
                        <option value="proximo">Próximo ao Vencimento</option>
                        <option value="normal">Normal</option>
                    </select>
                </div>

                <input
                    type="text"
                    placeholder="Pesquisar por Nome"
                    value={filtroPesquisa}
                    onChange={(e) => setFiltroPesquisa(e.target.value)}
                    className="input-pesquisa"
                />
            </div>

            <div className="resultados-acoes">
                <div className="resultados-contador">
                    <span className="label-resultados">Resultados</span>
                    <span className="contador-badge">{itensFiltrados.length}</span>
                </div>

                <div className="acoes-exportacao">
                    <button className="btn-exportar" onClick={handleExportarInventarioCompleto}><img src={PDF} alt="pdf-icon" />Exportar Inventário Completo (PDF)</button>
                    <button className="btn-exportar" onClick={handleExportarRelatorioReposicao}><img src={PDF} alt="pdf-icon" />Exportar Relatório De Reposição (PDF)</button>
                </div>
            </div>

            <div className="tabela-estoque-container">
                <table className="tabela-estoque">
                    <thead>
                        <tr>
                            <th>INSUMO</th>
                            <th>QTD / MÍN</th>
                            <th>CUSTO TOTAL</th>
                            <th>VALIDADE</th>
                            <th>ÚLTIMA AÇÃO</th>
                            <th>DATA ÚLT. MOVIMENTO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itensFiltrados.map((item) => {
                            const statusEstoque = getStatusEstoque(item.quantidade, item.minimo);
                            const statusValidade = getStatusValidade(item.validade);

                            return (
                                <tr key={item.id}>
                                    <td>
                                        <div className="insumo-info">
                                            <span className="insumo-nome">{item.nome}</span>
                                            <span className="insumo-fornecedor">
                                                {item.fornecedor} / {item.categoria}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`badge-estoque ${statusEstoque}`}>
                                            <span className="qtd-info">
                                                {item.quantidade} {item.unidade} / {item.minimo} {item.unidade}
                                            </span>
                                        </div>
                                    </td>
                                    <td>R$ {item.custoTotal.toFixed(2)}</td>
                                    <td>
                                        <div className={`badge-validade ${statusValidade}`}>
                                            <span className="data-validade">{formatarData(item.validade)}</span>
                                        </div>
                                    </td>
                                    <td>{item.ultimaAcao}</td>
                                    <td>{formatarData(item.dataUltMovimento)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
