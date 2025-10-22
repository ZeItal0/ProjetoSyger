import React, { useState } from "react";
import "../assets/despesas.css";
import GlassBox from "../components/GlassBox";

export default function Despesas() {
    const [descricao, setDescricao] = useState("");
    const [valorOriginal, setValorOriginal] = useState("");
    const [dataVencimento, setDataVencimento] = useState("");
    const [fornecedor, setFornecedor] = useState("");
    const [categoria, setCategoria] = useState("");
    const [statusDivida, setStatusDivida] = useState("");
    const [dataPagamento, setDataPagamento] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("");
    const [filtroMesAno, setFiltroMesAno] = useState("");

    const [contas, setContas] = useState([
        {
            id: 1,
            descricao: "descricao",
            fornecedor: "fornecedor",
            vencimento: "2024-01-15",
            valor: 0.00,
            status: "VENCIDA",
            categoria: "Aluguel",
            dataPagamento: null
        },
        {
            id: 2,
            descricao: "descricao",
            fornecedor: "fornecedor",
            vencimento: "2024-02-20",
            valor: 0.00,
            status: "VENCIDA",
            categoria: "Fornecedores",
            dataPagamento: null
        },
        {
            id: 3,
            descricao: "descricao",
            fornecedor: "fornecedor",
            vencimento: "2024-03-10",
            valor: 0.00,
            status: "Cancelado/Estornado",
            categoria: "Salários",
            dataPagamento: null
        },
        {
            id: 4,
            descricao: "descricao",
            fornecedor: "fornecedor",
            vencimento: "2024-01-25",
            valor: 0.00,
            status: "A pagar",
            categoria: "Impostos",
            dataPagamento: null
        },
    ]);

    const camposObrigatoriosPreenchidos = descricao && valorOriginal && dataVencimento && fornecedor && categoria && statusDivida && (statusDivida !== "Pago" || dataPagamento);

    const handleAdicionarConta = () => {
        if (!camposObrigatoriosPreenchidos) return;

        const novaConta = {
            id: contas.length + 1,
            descricao,
            fornecedor,
            vencimento: dataVencimento,
            valor: parseFloat(valorOriginal),
            status: statusDivida,
            categoria,
            dataPagamento: statusDivida === "Pago" ? dataPagamento : null
        };

        setContas([...contas, novaConta]);
        setDescricao("");
        setValorOriginal("");
        setDataVencimento("");
        setFornecedor("");
        setCategoria("");
        setStatusDivida("");
        setDataPagamento("");
    };

    const handlePagar = (id) => {
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        setContas(contas.map(conta =>
            conta.id === id ? { ...conta, status: "Pago", dataPagamento: dataAtual } : conta
        ));
    };

    const handleDesfazer = (id) => {
        setContas(contas.map(conta =>
            conta.id === id ? { ...conta, status: "A pagar", dataPagamento: null } : conta
        ));
    };

    const handleDeletar = (id) => {
        setContas(contas.filter(conta => conta.id !== id));
    };

    const contasFiltradas = contas.filter((conta) => {

        if (filtroCategoria && conta.categoria !== filtroCategoria) {
            return false;
        }

        if (filtroStatus && conta.status !== filtroStatus) {
            return false;
        }

        if (filtroMesAno) {
            const [ano, mes] = filtroMesAno.split('-');
            const [anoVencimento, mesVencimento] = conta.vencimento.split('-');
            if (ano !== anoVencimento || mes !== mesVencimento) {
                return false;
            }
        }

        return true;
    });

    const contasAPagar = contasFiltradas.filter(c => c.status !== "Pago" && c.status !== "Cancelado/Estornado").length;
    const totalDespesas = contasFiltradas.length;

    const getStatusClass = (status) => {
        switch (status) {
            case "VENCIDA": return "status-vencida";
            case "A pagar": return "status-a-pagar";
            case "Pago": return "status-pago";
            case "Cancelado/Estornado": return "status-cancelado";
            default: return "";
        }
    };

    return (
        <div className="controle-despesas-container">
            <h1>Controle de Despesas</h1>

            <GlassBox>
                <div className="novo-lancamento">
                    <h2>Novo Lançamento (Contas a Pagar)</h2>

                    <div className="form-grid">
                        <input type="text" placeholder="Descrição Ex: Aluguel /Mov" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                        <input type="number" placeholder="Valor Original (R$) 0.00" value={valorOriginal} onChange={(e) => setValorOriginal(e.target.value)} />
                        <input type="date" placeholder="Data de Vencimento dd/mm/aaaa" value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} />
                        <input type="text" placeholder="Fornecedor/Destinatário" value={fornecedor} onChange={(e) => setFornecedor(e.target.value)} />

                        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                            <option value="">Categoria Financeira + Custo de Mercado/Insumos</option>
                            <option value="Aluguel">Aluguel</option>
                            <option value="Fornecedores">Fornecedores</option>
                            <option value="Salários">Salários</option>
                            <option value="Impostos">Impostos</option>
                            <option value="Outros">Outros</option>
                        </select>

                        <select value={statusDivida} onChange={(e) => setStatusDivida(e.target.value)}>
                            <option value="">Status da Dívida</option>
                            <option value="A pagar">A pagar</option>
                            <option value="Pago">Pago</option>
                            <option value="VENCIDA">VENCIDA</option>
                            <option value="Cancelado/Estornado">Cancelado/Estornado</option>
                        </select>
                    </div>

                    {statusDivida === "Pago" && (
                        <div className="data-pagamento-container">
                            <input type="date" placeholder="Data de Pagamento" value={dataPagamento} onChange={(e) => setDataPagamento(e.target.value)} className="data-pagamento-input" />
                        </div>
                    )}

                    <p className="info-dre">Importante para análise de DRE</p>

                    <button className={`btn-adicionar ${camposObrigatoriosPreenchidos ? 'ativo' : ''}`} onClick={handleAdicionarConta} disabled={!camposObrigatoriosPreenchidos}>
                        {camposObrigatoriosPreenchidos ? 'Adicionar Conta' : 'Preencha todos os campos obrigatórios'}
                    </button>
                </div>
            </GlassBox>

            <div className="contas-registradas">
                <div className="header-contas-registradas">
                    <h2>Contas Registradas</h2>

                    <div className="filtros-container">
                        <select className="filtro-select" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                            <option value="">Filtrar por categoria</option>
                            <option value="Aluguel">Aluguel</option>
                            <option value="Fornecedores">Fornecedores</option>
                            <option value="Salários">Salários</option>
                            <option value="Impostos">Impostos</option>
                            <option value="Outros">Outros</option>
                        </select>

                        <select className="filtro-select" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                            <option value="">Filtrar por status</option>
                            <option value="A pagar">A pagar</option>
                            <option value="Pago">Pago</option>
                            <option value="VENCIDA">VENCIDA</option>
                            <option value="Cancelado/Estornado">Cancelado/Estornado</option>
                        </select>

                        <input type="month" className="filtro-select filtro-mes-ano" value={filtroMesAno} onChange={(e) => setFiltroMesAno(e.target.value)} placeholder="Filtrar por Mês/ano"/>
                    </div>
                </div>

                <div className="resumo-cards">
                    <div className="card-resumo contas-a-pagar">
                        <p>Contas A Pagar</p>
                        <h3>{contasAPagar}</h3>
                    </div>
                    <div className="card-resumo total-despesas">
                        <p>Total de Despesas Registradas</p>
                        <h3>{totalDespesas}</h3>
                    </div>
                </div>

                <div className="tabela-container">
                    <table className="tabela-contas">
                        <thead>
                            <tr>
                                <th>DESCRIÇÃO</th>
                                <th>FORNECEDOR</th>
                                <th>VENCIMENTO</th>
                                <th>VALOR</th>
                                <th>STATUS</th>
                                <th>CATEGORIA</th>
                                <th>AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contasFiltradas.map((conta) => (
                                <tr key={conta.id}>
                                    <td>{conta.descricao}</td>
                                    <td>{conta.fornecedor}</td>
                                    <td>{conta.vencimento}</td>
                                    <td>R$ {conta.valor.toFixed(2)}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(conta.status)}`}>
                                            {conta.status}
                                            {conta.status === "Pago" && conta.dataPagamento && (
                                                <span className="data-pagamento-badge"> ({conta.dataPagamento})</span>
                                            )}
                                        </span>
                                    </td>
                                    <td>{conta.categoria}</td>
                                    <td className="acoes-cell">
                                        {conta.status === "A pagar" && (
                                            <button className="btn-acao btn-pagar" onClick={() => handlePagar(conta.id)}>Pagar</button>
                                        )}
                                        {conta.status === "Pago" && (
                                            <><button className="btn-acao btn-desfazer" onClick={() => handleDesfazer(conta.id)}>Desfazer</button></>
                                        )}
                                        {conta.status === "Cancelado/Estornado" && (
                                            <button className="btn-acao btn-desfazer" onClick={() => handleDesfazer(conta.id)}>Desfazer</button>
                                        )}
                                        {conta.status === "VENCIDA" && (
                                            <button className="btn-acao btn-pagar" onClick={() => handlePagar(conta.id)}>Pagar</button>
                                        )}
                                        <button className="btn-acao btn-deletar" onClick={() => handleDeletar(conta.id)}>
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

