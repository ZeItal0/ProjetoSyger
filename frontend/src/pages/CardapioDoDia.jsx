import React, { useState, useEffect } from 'react';
import "../assets/menuCardapio.css";
import plus from "../icons/plusadd.png";
import minus from "../icons/minusremove.png";

const PratoGeralItem = ({ nome, porcao, categoria, preco, estoqueStatus, estoqueUnidades, onAdicionar }) => {
    const getEstoqueDisplay = () => {
        let statusClass = '';
        let statusText = '';
        
        if (estoqueStatus === 'MINIMO') {
            statusClass = 'estoque-minimo';
            statusText = `Estoque: Abaixo do MÍNIMO`;
        } else if (estoqueStatus === 'OK') {
            statusClass = 'estoque-ok';
            statusText = `Estoque: OK (${estoqueUnidades} unidades)`;
        } else if (estoqueStatus === 'EXCESSO') {
            statusClass = 'estoque-excesso';
            statusText = `Estoque: Excesso (${estoqueUnidades} unidades)`;
        }

        return (
            <span className={statusClass}>
                {statusText}
            </span>
        );
    };

    return (
        <div className="prato-geral-item">
            <div className="prato-info">
                <p className="prato-nome"> {nome} - ({porcao}) {porcao.includes('g') ? 'Og' : ''} </p>
                <p className="prato-detalhes"> Categoria do prato | preço {preco.toFixed(2).replace('.', ',')} R$</p>
                <p className="prato-estoque"> {getEstoqueDisplay()}</p>
            </div>
            <button className="adicionar-btn" onClick={onAdicionar}> <img src={plus} alt='plus-icon'/> </button>
        </div>
    );
};

const CardapioDoDiaItem = ({ nome, porcao, categoria, preco, status, onRemover }) => {

    const getStatusDisplay = () => {
        let statusClass = '';
        let statusText = '';

        if (status === 'ESGOTADO') {
            statusClass = 'status-esgotado';
            statusText = 'Esgotado';
        } else if (status === 'DISPONIVEL') {
            statusClass = 'status-disponivel';
            statusText = 'Disponível';
        }

        return (
            <span className={statusClass}>
                {statusText}
            </span>
        );
    };

    return (
        <div className="cardapio-dia-item">
            <div className="prato-info">
                <p className="prato-nome"> {nome} - ({porcao}) {porcao.includes('g') ? 'Og' : ''} </p>
                <p className="prato-detalhes"> Categoria do prato | preço {preco.toFixed(2).replace('.', ',')} R$ </p>
            </div>
            <div className="item-acoes">
                {getStatusDisplay()}
                <button className="remover-btn" onClick={onRemover}>
                    <img src={minus} alt='minus-icon'/>
                </button>
            </div>
        </div>
    );
};


export default function CardapioDoDia () {

    const [pratosGerais, setPratosGerais] = useState([
        { id: 1, nome: 'Feijoada', porcao: '500g', categoria: 'Carnes', preco: 25.00, estoqueStatus: 'MINIMO', estoqueUnidades: 5 },
        { id: 2, nome: 'Lasanha Bolonhesa', porcao: '400g', categoria: 'Massas', preco: 35.50, estoqueStatus: 'OK', estoqueUnidades: 20 },
        { id: 3, nome: 'Salada Caesar', porcao: 'P', categoria: 'Grãos', preco: 18.90, estoqueStatus: 'EXCESSO', estoqueUnidades: 50 },
        { id: 6, nome: 'Refrigerante Cola', porcao: '350ml', categoria: 'Bebidas', preco: 6.00, estoqueStatus: 'OK', estoqueUnidades: 100 },
        { id: 7, nome: 'Coxinha Frango', porcao: '100g', categoria: 'Lanches', preco: 7.50, estoqueStatus: 'MINIMO', estoqueUnidades: 8 },
        { id: 8, nome: 'Pão de Queijo', porcao: '50g', categoria: 'Aperitivos', preco: 3.00, estoqueStatus: 'EXCESSO', estoqueUnidades: 200 },
        { id: 9, nome: 'Torta de Limão', porcao: 'Fatia', categoria: 'Sobremesas', preco: 15.00, estoqueStatus: 'OK', estoqueUnidades: 15 },
    ]);

    const todasCategorias = ['Todos', 'Carnes', 'Grãos', 'Massas', 'Bebidas', 'Sobremesas', 'Lanches', 'Aperitivos'];
    const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
    const [termoBusca, setTermoBusca] = useState('');

    const [cardapioDia, setCardapioDia] = useState([
        { id: 4, nome: 'Pudim de Leite', porcao: '150g', categoria: 'Sobremesas', preco: 12.00, status: 'ESGOTADO' },
        { id: 5, nome: 'Suco de Laranja', porcao: '300ml', categoria: 'Bebidas', preco: 8.00, status: 'DISPONIVEL' },
    ]);

    const pratosFiltrados = pratosGerais.filter(prato => {
        const filtroCategoria = categoriaAtiva === 'Todos' || prato.categoria === categoriaAtiva;
        const termo = termoBusca.toLowerCase();
        const filtroBusca = prato.nome.toLowerCase().includes(termo) || prato.categoria.toLowerCase().includes(termo);

        return filtroCategoria && filtroBusca;
    });

    const handleAdicionarPrato = (pratoId) => {
        const pratoParaAdicionar = pratosGerais.find(p => p.id === pratoId);

        if (pratoParaAdicionar) {
            setPratosGerais(pratosGerais.filter(p => p.id !== pratoId));

            const novoPratoDia = {
                id: pratoParaAdicionar.id,
                nome: pratoParaAdicionar.nome,
                porcao: pratoParaAdicionar.porcao,
                categoria: pratoParaAdicionar.categoria,
                preco: pratoParaAdicionar.preco,
                status: 'DISPONIVEL'
            };
            setCardapioDia([...cardapioDia, novoPratoDia]);
        }
    };

    const handleRemoverPrato = (pratoId) => {
        const pratoParaRemover = cardapioDia.find(p => p.id === pratoId);

        if (pratoParaRemover) {
            
            setCardapioDia(cardapioDia.filter(p => p.id !== pratoId));

            const pratoOriginal = {
                id: pratoParaRemover.id,
                nome: pratoParaRemover.nome,
                porcao: pratoParaRemover.porcao,
                categoria: pratoParaRemover.categoria,
                preco: pratoParaRemover.preco,
                estoqueStatus: 'OK',
                estoqueUnidades: 10
            };

            setPratosGerais([...pratosGerais, pratoOriginal]);
        }
    };

    return (
        <div className="cardapio-container">
            <header className="cardapio-header">
                <h1>Montagem do Cardápio do Dia</h1>
                <p className="header-descricao">Defina quais pratos estão disponíveis para venda hoje</p>
            </header>

            <div className="cardapio-content">
                <div className="cardapio-geral-coluna">
                    <h2>Cardápio Geral</h2>
                    
                    <nav className="categorias-nav-cardapio">
                        {todasCategorias.map(categoria => (
                            <button 
                                key={categoria}
                                className={`categoria-btn-cardapio ${categoriaAtiva === categoria ? 'active' : ''}`}
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
                        {pratosFiltrados.map(prato => (
                            <PratoGeralItem 
                                key={prato.id}
                                nome={prato.nome}
                                porcao={prato.porcao}
                                categoria={prato.categoria}
                                preco={prato.preco}
                                estoqueStatus={prato.estoqueStatus}
                                estoqueUnidades={prato.estoqueUnidades}
                                onAdicionar={() => handleAdicionarPrato(prato.id)}
                            />
                        ))}
                        {pratosFiltrados.length === 0 && (
                            <p className="sem-resultados">Nenhum prato encontrado com os filtros aplicados.</p>
                        )}
                    </div>
                </div>

                <div className="cardapio-dia-coluna">
                    <h2>
                        Cardápio Do Dia 
                        <span className="item-count"> ({cardapioDia.length} itens)</span>
                    </h2>
                    <p className="coluna-descricao">Estes itens estarão visíveis para área de Vendas</p>

                    <div className="cardapio-dia-lista">
                        {cardapioDia.map(prato => (
                            <CardapioDoDiaItem
                                key={prato.id}
                                nome={prato.nome}
                                porcao={prato.porcao}
                                categoria={prato.categoria}
                                preco={prato.preco}
                                status={prato.status}
                                onRemover={() => handleRemoverPrato(prato.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
