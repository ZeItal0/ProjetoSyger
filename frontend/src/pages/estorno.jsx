import React, { useState, useEffect } from "react";
import "../assets/historico.css";
import Paginacao from "../components/paginacaoComponent";
import useVendasRapidas from "../api/useVendasRapidas";

export default function Estorno() {

  const { vendas, paginaAtual, setPaginaAtual, totalPaginas, estornarVenda, loading } = useVendasRapidas();


  return (
    <div className="historico-container">
      <div className="lista-vendas">
        <h2>Histórico de Vendas</h2>
        <div className="linha-topo"></div>
        <div className="historico-vendas">
          {vendas.map((venda) => (
            <div key={venda.id} className="card-venda">
              <div className="info-venda">
                <p>
                  <strong>#{venda.numero}</strong> | Tipo: {venda.mesa}
                </p>
                <p>
                  Data: {venda.data} | Pagamento: {venda.formaPagamento} | Pago
                </p>
                <p>Itens: {venda.itens.map((i) => i.nome).join(", ")}</p>
              </div>
              <div className="valor-e-botao">
                <span className="valor">R$ {venda.valor.toFixed(2)}</span>
                <button className="btn-estornar" onClick={() => estornarVenda(venda.id)}> Estornar Venda</button>
              </div>
            </div>
          ))}
        </div>

        <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} setPaginaAtual={setPaginaAtual}/>
      </div>
    </div>
  );
}
