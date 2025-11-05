import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../assets/relatoriosDeVenda.css";
import PDF from "../icons/pdf.png";
import Email from "../icons/email.png"

export default function RelatoriosDeVendas() {
    const [filtroPagamento, setFiltroPagamento] = useState("");
    const [filtroTipoVenda, setFiltroTipoVenda] = useState("");
    const [filtroPeriodo, setFiltroPeriodo] = useState("");
    const [filtroDataEspecifica, setFiltroDataEspecifica] = useState("");
    const [diaSelecionado, setDiaSelecionado] = useState(null);
    const [modoComparacao, setModoComparacao] = useState(false);
    const [filtroDataInicioComparacao, setFiltroDataInicioComparacao] = useState("");
    const [filtroDataFimComparacao, setFiltroDataFimComparacao] = useState("");


    const [vendas] = useState([
        { id: 1, data: "2025-03-03", produto: "Feijoada", quantidade: 2, valorUnitario: 35.00, desconto: 5.00, tipoPagamento: "Cartão", tipoVenda: "Mesa" },
        { id: 2, data: "2025-03-03", produto: "Picanha", quantidade: 1, valorUnitario: 80.00, desconto: 0, tipoPagamento: "Dinheiro", tipoVenda: "Venda Rápida" },
        { id: 3, data: "2025-03-10", produto: "Marmita Executiva", quantidade: 3, valorUnitario: 25.00, desconto: 7.50, tipoPagamento: "PIX", tipoVenda: "Marmita" },
        { id: 4, data: "2025-03-10", produto: "Marmita bolinho", quantidade: 3, valorUnitario: 25.00, desconto: 7.50, tipoPagamento: "PIX", tipoVenda: "Marmita" },
        { id: 5, data: "2025-03-10", produto: "Marmita bolo", quantidade: 3, valorUnitario: 25.00, desconto: 7.50, tipoPagamento: "PIX", tipoVenda: "Marmita" },
    ]);

    const gerarPDF = () => {
        console.log("Gerar PDF clicado");
    };

    const enviarEmail = () => {
        console.log("Enviar por e-mail clicado");
    };


    const vendasFiltradas = vendas.filter((venda) => {
        if (filtroPagamento && venda.tipoPagamento !== filtroPagamento) return false;
        if (filtroTipoVenda && venda.tipoVenda !== filtroTipoVenda) return false;
        if (filtroPeriodo && filtroDataEspecifica) {
            if (venda.data !== filtroDataEspecifica) return false;
        }

        if (diaSelecionado) {
            const dataSelecionada = diaSelecionado.toISOString().split("T")[0];
            if (venda.data !== dataSelecionada) return false;
        }

        return true;
    });

    const totalBruto = vendasFiltradas.reduce((acc, venda) => acc + (venda.valorUnitario * venda.quantidade), 0);
    const totalDescontos = vendasFiltradas.reduce((acc, venda) => acc + venda.desconto, 0);
    const totalLiquido = totalBruto - totalDescontos;
    const quantidadeVendas = vendasFiltradas.length;
    const ticketMedio = quantidadeVendas > 0 ? totalLiquido / quantidadeVendas : 0;

    const produtosContagem = {};
    vendasFiltradas.forEach((venda) => {
        produtosContagem[venda.produto] = (produtosContagem[venda.produto] || 0) + venda.quantidade;
    });

    const top10Pratos = Object.entries(produtosContagem)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([produto, quantidade]) => ({ produto, quantidade }));

    const handleToggleComparacao = () => setModoComparacao(!modoComparacao);

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
                            <option value="Cartão">Cartão</option>
                            <option value="PIX">PIX</option>
                        </select>
                    </div>

                    <div className="filtro-grupo">
                        <select value={filtroTipoVenda} onChange={(e) => setFiltroTipoVenda(e.target.value)}>
                            <option value="">Tipo de Venda</option>
                            <option value="Mesa">Mesa</option>
                            <option value="Marmita">Marmita</option>
                            <option value="Venda Rápida">Venda Rápida</option>
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

                    <button className="btn-comparacao" onClick={handleToggleComparacao}>Comparar com Outro Período</button>

                    {modoComparacao && (
                        <div className="comparacao-section">
                            <h3>Período de Comparação</h3>
                            <div className="filtro-grupo">
                                <label>Data Início:</label>
                                <input
                                    type="date"
                                    value={filtroDataInicioComparacao}
                                    onChange={(e) => setFiltroDataInicioComparacao(e.target.value)}
                                />
                            </div>
                            <div className="filtro-grupo">
                                <label>Data Fim:</label>
                                <input
                                    type="date"
                                    value={filtroDataFimComparacao}
                                    onChange={(e) => setFiltroDataFimComparacao(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="coluna-direita">
                    <h2 className="calendario-titulo">Calendário</h2>
                    <div className="calendario-container">
                        <Calendar
                            onChange={(data) => {
                                setDiaSelecionado(data);
                                setFiltroDataEspecifica(data.toISOString().split("T")[0]);
                            }}
                            value={diaSelecionado}
                            locale="pt-BR"
                            nextLabel=">"
                            prevLabel="<"
                            calendarType="gregory"
                        />
                    </div>
                    <div className="botoes-exportar">
                        <button className="botao-exportar" onClick={gerarPDF}><img src={PDF} alt="pdf-img"/> Exportar PDF</button>
                        <button className="botao-email" onClick={enviarEmail}><img src={Email} alt="Email-img"/> Enviar por E-mail</button>
                    </div>
                </div>
            </div>

            <div className="resumo-section">
                <h2>Resumo de Vendas</h2>
                <div className="cards-resumo">
                    <div className="card-resumo">
                        <p className="card-label">Total Bruto</p>
                        <p className="card-valor">R$ {totalBruto.toFixed(2)}</p>
                    </div>
                    <div className="card-resumo">
                        <p className="card-label">Total Líquido</p>
                        <p className="card-valor">R$ {totalLiquido.toFixed(2)}</p>
                    </div>
                    <div className="card-resumo">
                        <p className="card-label">Descontos</p>
                        <p className="card-valor">R$ {totalDescontos.toFixed(2)}</p>
                    </div>
                    <div className="card-resumo">
                        <p className="card-label">Quantidade</p>
                        <p className="card-valor">{quantidadeVendas}</p>
                    </div>
                    <div className="card-resumo">
                        <p className="card-label">Ticket Médio</p>
                        <p className="card-valor">R$ {ticketMedio.toFixed(2)}</p>
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
                            {top10Pratos.length > 0 ? (
                                top10Pratos.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.produto}</td>
                                        <td>{item.quantidade}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td>1</td>
                                    <td>nome do produto</td>
                                    <td>0</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
