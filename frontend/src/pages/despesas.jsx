import React, { useState, useEffect } from "react";
import "../assets/despesas.css";
import { useDespesas } from "../api/useDespesas";

export default function Despesas() {
  const {
  descricao,
  setDescricao,
  valorOriginal,
  setValorOriginal,
  dataVencimento,
  setDataVencimento,
  fornecedor,
  setFornecedor,
  categoria,
  setCategoria,
  statusDivida,
  setStatusDivida,
  dataPagamento,
  setDataPagamento,
  filtroCategoria,
  setFiltroCategoria,
  filtroStatus,
  setFiltroStatus,
  filtroMesAno,
  setFiltroMesAno,
  fornecedores,
  contas,
  contasFiltradas,
  contasAPagar,
  totalDespesas,
  getStatusClass,
  handleAdicionarConta,
  handlePagar,
  handleDesfazer,
  handleDeletar,
  camposObrigatoriosPreenchidos,
  } = useDespesas();

  return (
    <div className="controle-despesas-container">
      <h1>Controle de Despesas</h1>

      <div className="novo-lancamento">
        <h2>Novo Lançamento (Contas a Pagar)</h2>
        <div className="form-grid">
          <input type="text" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)}/>
          <input type="number" placeholder="Valor Original (R$)" value={valorOriginal} onChange={(e) => setValorOriginal(e.target.value)}/>
          <input type="date" value={dataVencimento}onChange={(e) => setDataVencimento(e.target.value)}/>

          <select value={fornecedor} onChange={(e) => setFornecedor(e.target.value)}>
            <option value="">Fornecedores</option>
            {fornecedores.map((item) => (
              <option key={item.id_fornecedor} value={item.id_fornecedor}>{item.nome_empresa}</option>
            ))}
          </select>

          <select value={categoria}onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Categoria Financeira</option>
            <option value="Aluguel">Aluguel</option>
            <option value="Fornecedores">Fornecedores</option>
            <option value="Salários">Salários</option>
            <option value="Impostos">Impostos</option>
            <option value="Outros">Outros</option>
          </select>

          <select value={statusDivida}onChange={(e) => setStatusDivida(e.target.value)}>
            <option value="">Status da Dívida</option>
            <option value="A pagar">A pagar</option>
            <option value="Pago">Pago</option>
            <option value="VENCIDA">VENCIDA</option>
            <option value="Cancelado/Estornado">Cancelado/Estornado</option>
          </select>
        </div>

        {statusDivida === "Pago" && (
          <div className="data-pagamento-container">
            <input type="date" value={dataPagamento} onChange={(e) => setDataPagamento(e.target.value)}className="data-pagamento-input"/>
          </div>
        )}

        <button className={`btn-adicionar ${camposObrigatoriosPreenchidos ? "ativo" : ""}`} onClick={handleAdicionarConta} disabled={!camposObrigatoriosPreenchidos}>
          {camposObrigatoriosPreenchidos
            ? "Adicionar Conta"
            : "Preencha todos os campos obrigatórios"}
        </button>
      </div>

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
              <option value="A_pagar">A pagar</option>
              <option value="Pago">Pago</option>
              <option value="Vencida">VENCIDA</option>
              <option value="Cancelado_Estornado">Cancelado/Estornado</option>
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
                  <td>{conta.fornecedorNome || conta.fornecedor}</td>
                  <td>{conta.vencimento}</td>
                  <td>R$ {conta.valor.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(conta.status)}`}>
                      {conta.status === "Pago" ? (
                        <>
                          Pago{" "}
                          {conta.dataPagamento && (
                            <span className="data-pagamento-badge">({conta.dataPagamento})</span>
                          )}
                        </>
                      ) : (
                        conta.status
                      )}
                    </span>

                  </td>
                  <td className="acoes-cell">
                    {conta.status === "A_pagar" && (
                      <button className="btn-acao btn-pagar" onClick={() => handlePagar(conta.id)}>
                        Pagar
                      </button>
                    )}
                    {conta.status === "Pago" && (
                      <button className="btn-acao btn-desfazer" onClick={() => handleDesfazer(conta.id)}>
                        Desfazer
                      </button>
                    )}
                    {conta.status === "Cancelado_Estornado" && (
                      <button className="btn-acao btn-desfazer" onClick={() => handleDesfazer(conta.id)}>
                        Desfazer
                      </button>
                    )}
                    {conta.status === "Vencida" && (
                      <button className="btn-acao btn-pagar" onClick={() => handlePagar(conta.id)}>
                        Pagar
                      </button>
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
