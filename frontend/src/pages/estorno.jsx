import React, { useState } from "react";
import "../assets/historico.css";

export default function Estorno() {
  const [vendas] = useState([
    {
      id: 1,
      numero: "001",
      mesa: "00",
      data: "13/10/2025 00:00:01",
      formaPagamento: "Pix",
      produtos: "Nome dos Produtos",
      valor: 0.0,
    },
    {
      id: 2,
      numero: "002",
      mesa: "00",
      data: "13/10/2025 00:00:01",
      formaPagamento: "Cartão",
      produtos: "Nome dos Produtos",
      valor: 0.0,
    },
    {
      id: 3,
      numero: "003",
      mesa: "00",
      data: "13/10/2025 00:00:01",
      formaPagamento: "Dinheiro",
      produtos: "Nome dos Produtos",
      valor: 0.0,
    },

  ]);

  const [vendaSelecionada, setVendaSelecionada] = useState(null);

  return (
    <div className="historico-container">

      <div className="lista-vendas">
        <h2>Histórico de Vendas</h2>
        <div className="linha-topo"></div>
        <div className="historico-vendas">
          {vendas.map((venda) => (
            <div key={venda.id} className="card-venda">

              <div className="info-venda">
                <p><strong>#{venda.numero}</strong> | Mesa: {venda.mesa}</p>
                <p>Data: {venda.data} | Pagamento: {venda.formaPagamento} | Pago</p>
                <p>Itens: {venda.produtos}</p>
              </div>

              <div className="valor-e-botao">
                <span className="valor">R$ {venda.valor.toFixed(2)}</span>
                <button className="btn-estornar" onClick={() => setVendaSelecionada(venda)}>Estornar Venda</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {vendaSelecionada && (
        <div className="confirmacao-estorno">
          <h4>Confirmação de Estorno</h4>

          <p>Deseja <strong>“ESTORNAR”</strong> a venda da Mesa{" "}
            <strong>{vendaSelecionada.mesa}</strong> no valor de{" "}<strong>  R$ {vendaSelecionada.valor.toFixed(2).replace(".", ",")}</strong>?</p>
          <p className="aviso">Esta ação não pode ser desfeita.</p>

          <div className="botoes-estorno">
            <button className="cancelar" onClick={() => setVendaSelecionada(null)}>Cancelar</button>
            <button className="confirmar" onClick={() => { alert("Venda estornada!"); setVendaSelecionada(null);}}>Confirmar</button>
          </div>
        </div>
      )}
    </div>
  );
}
