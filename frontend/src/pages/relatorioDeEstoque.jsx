import React from "react";
import "../assets/relatorioDeEstoque.css";
import PDF from "../icons/pdf.png";
import Paginacao from "../components/paginacaoComponent";
import { useEstoque } from "../api/useEstoque";

export default function RelatorioDeEstoque() {
    const {
        fornecedores,
        itensEstoque,
        loading,
        filtroFornecedor,
        filtroNivelEstoque,
        filtroCategoria,
        filtroStatusValidade,
        filtroPesquisa,
        setFiltroFornecedor,
        setFiltroNivelEstoque,
        setFiltroCategoria,
        setFiltroStatusValidade,
        setFiltroPesquisa,
        getStatusEstoque,
        getStatusValidade,
        formatarData,
        exportarInventario,
        exportarReposicao,
        paginaAtual,
        setPaginaAtual,
        totalPaginas,
        totalResultados
    } = useEstoque();

    return (
        <div className="relatorio-estoque-container">
            <h1>Relatório de Estoque</h1>

            <div className="filtros-section">
                <h2>Filtros</h2>
                <div className="filtros-grid">
                    <select value={filtroFornecedor} onChange={(e) => setFiltroFornecedor(e.target.value)}>
                        <option value="">Por Fornecedor</option>
                        {fornecedores.map((f) => (
                            <option key={f.id_fornecedor} value={f.nome_empresa}>
                                {f.nome_empresa}
                            </option>
                        ))}
                    </select>

                    <select value={filtroNivelEstoque} onChange={(e) => setFiltroNivelEstoque(e.target.value)}>
                        <option value="">Por Nível de Estoque</option>
                        <option value="abaixo">Abaixo do Mínimo</option>
                        <option value="ok">Ok</option>
                        <option value="excesso">Excesso</option>
                    </select>

                    <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                        <option value="">Categoria</option>
                        <option value="Carnes">Carnes</option>
                        <option value="Laticínios">Laticínios</option>
                        <option value="Grãos">Grãos</option>
                        <option value="Massas">Massas</option>
                        <option value="Gorduras">Gorduras</option>
                        <option value="Temperos">Temperos</option>
                        <option value="Bebidas">Bebidas</option>
                        <option value="Congelados">Congelados</option>
                    </select>

                    <select value={filtroStatusValidade} onChange={(e) => setFiltroStatusValidade(e.target.value)}>
                        <option value="">Por Status de Validade</option>
                        <option value="vencido">Vencido</option>
                        <option value="proximo">Próximo ao Vencimento</option>
                        <option value="normal">Normal</option>
                    </select>
                </div>

                <input type="text" placeholder="Pesquisar por Nome" value={filtroPesquisa} onChange={(e) => setFiltroPesquisa(e.target.value)} className="input-pesquisa"/>
            </div>

            <div className="resultados-acoes">
                <div className="resultados-contador">
                    <span className="label-resultados">Resultados</span>
                    <span className="contador-badge">{totalResultados}</span>
                </div>

                <div className="acoes-exportacao">
                    <button className="btn-exportar" onClick={exportarInventario}><img src={PDF} alt="pdf-icon" />Exportar Inventário Completo (PDF)</button>

                    <button className="btn-exportar" onClick={exportarReposicao}><img src={PDF} alt="pdf-icon" /> Exportar Relatório de Reposição (PDF)</button>
                </div>
            </div>

            <div className="tabela-estoque-container">
                {loading ? (
                    <p>Carregando</p>
                ) : (
                    <>
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
                                {itensEstoque.map((item) => {
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
                                                    <span className="qtd-info">{item.quantidade} / {item.minimo}</span>
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
                        <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} setPaginaAtual={setPaginaAtual}/>
                    </>
                )}
            </div>
        </div>
    );
}
