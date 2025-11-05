import React, { useState, useEffect } from "react";
import "../assets/menuCardapio.css";
import plus from "../icons/plusadd.png";
import minus from "../icons/minusremove.png";
import { useCardapioDoDia } from "../api/useCardapioDoDia";

const PratoGeralItem = ({ nome, porcao, categoria, preco = 0, onAdicionar }) => (
    <div className="prato-geral-item">
        <div className="prato-info">
            <p className="prato-nome">
                {nome} - ({porcao})
            </p>
            <p className="prato-detalhes">
                {categoria} | preço {Number(preco).toFixed(2).replace(".", ",")} R$
            </p>
        </div>
        <button className="adicionar-btn" onClick={onAdicionar}>
            <img src={plus} alt="plus-icon" />
        </button>
    </div>
);

const CardapioDoDiaItem = ({
    id,
    nome,
    porcao,
    categoria,
    preco = 0,
    status,
    onRemover,
    onStatusChange,
}) => {
    const getStatusDisplay = () => {
        let statusClass = "";
        let statusText = "";

        if (status === "ESGOTADO") {
            statusClass = "status-esgotado";
            statusText = "Esgotado";
        } else if (status === "DISPONIVEL") {
            statusClass = "status-disponivel";
            statusText = "Disponível";
        }

        return <span className={statusClass}>{statusText}</span>;
    };

    return (
        <div className="cardapio-dia-item">
            <div className="prato-info">
                <p className="prato-nome">
                    {nome} - ({porcao})
                </p>
                <p className="prato-detalhes">
                    {categoria} | preço {Number(preco).toFixed(2).replace(".", ",")} R$
                </p>
            </div>
            <div className="item-acoes">
                {getStatusDisplay()}
                <select
                    value={status}
                    onChange={(e) => onStatusChange(id, e.target.value)}
                    className="status-select"
                >
                    <option value="DISPONIVEL">Disponível</option>
                    <option value="ESGOTADO">Esgotado</option>
                </select>


                <button className="remover-btn" onClick={() => onRemover(id)}>
                    <img src={minus} alt="minus-icon" />
                </button>
            </div>
        </div>
    );
};

export default function CardapioDoDia() {
    const {
        pratosGerais,
        cardapioDia,
        todasCategorias,
        categoriaAtiva,
        termoBusca,
        pratosFiltrados,
        setCategoriaAtiva,
        setTermoBusca,
        handleAdicionarPrato,
        handleRemoverPrato,
        handleStatusChange,
        handleSalvarCardapio,
    } = useCardapioDoDia();
    return (
        <div className="cardapio-container">
            <header className="cardapio-header">
                <h1>Montagem do Cardápio do Dia</h1>
                <p className="header-descricao">
                    Defina quais pratos estão disponíveis para venda hoje
                </p>
            </header>

            <div className="cardapio-content">
                <div className="cardapio-geral-coluna">
                    <h2>Cardápio Geral</h2>

                    <nav className="categorias-nav-cardapio">
                        {todasCategorias.map((categoria) => (
                            <button
                                key={categoria}
                                className={`categoria-btn-cardapio ${categoriaAtiva === categoria ? "active" : ""}`}
                                onClick={() => setCategoriaAtiva(categoria)}
                            >
                                {categoria}
                            </button>
                        ))}
                    </nav>

                    <div className="busca-container">
                        <input
                            type="text"
                            placeholder="Buscar Prato"
                            className="busca-input"
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                        />
                    </div>

                    <div className="pratos-gerais-lista">
                        {pratosFiltrados.map((prato) => (
                            <PratoGeralItem
                                key={prato.id}
                                nome={prato.nome}
                                porcao={prato.porcao}
                                categoria={prato.categoria}
                                preco={prato.preco}
                                onAdicionar={() => handleAdicionarPrato(prato.id)}
                            />
                        ))}
                        {pratosFiltrados.length === 0 && (
                            <p className="sem-resultados">
                                Nenhum prato encontrado com os filtros aplicados.
                            </p>
                        )}
                    </div>
                </div>

                <div className="cardapio-dia-coluna">
                    <h2>
                        Cardápio Do Dia <span className="item-count">({cardapioDia.length} itens)</span>
                    </h2>
                    <p className="coluna-descricao">
                        Estes itens estarão visíveis para área de Vendas
                    </p>

                    <div className="cardapio-dia-lista">
                        {cardapioDia.map((prato) => (
                            <CardapioDoDiaItem
                                key={prato.id}
                                id={prato.id}
                                nome={prato.nome}
                                porcao={prato.porcao}
                                categoria={prato.categoria}
                                preco={prato.preco}
                                status={prato.status}
                                onStatusChange={(id, novoStatus) => handleStatusChange(id, novoStatus)}
                                onRemover={handleRemoverPrato}
                            />
                        ))}
                    </div>

                    {cardapioDia.length > 0 && (
                        <button
                            className="salvar-btn-cadapio-dia"
                            onClick={handleSalvarCardapio}
                        >
                            Salvar Cardápio do Dia
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
