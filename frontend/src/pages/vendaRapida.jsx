import React, { useState } from "react";
import "../assets/vendas.css";
import Dinheiro from "../icons/money.png";
import Cartao from "../icons/card.png";
import PIX from "../icons/PIX.png";
import Plus from "../icons/plus.png";
import Minus from "../icons/minus.png";
import Lixo from "../icons/trash.png";
import Mesa from "../icons/mesa.png";
import Marmita from "../icons/marmita.png";
import Plusadd from "../icons/plusadd.png";

const categorias = ["Todos", "Carnes", "Grãos", "Massas", "Bebidas", "Sobremesas", "Lanches", "Aperitivos"];

const produtosExemplo = [
  { id: 1, nome: "Nome do prato", preco: 0.05, categoria: "Carnes", unidade: "porção" },
  { id: 2, nome: "Nome do prato", preco: 0.05, categoria: "Massas", unidade: "porção" },
  { id: 3, nome: "Nome do prato", preco: 0.05, categoria: "Bebidas", unidade: "porção" },
];

const marmitasIniciais = [
  { id: 0, nome: "Marmita 01", status: "aguardando", total: 0, itens: [] },
  { id: 1, nome: "Marmita 02", status: "aguardando", total: 0, itens: [] },
  { id: 2, nome: "Marmita 03", status: "aguardando", total: 0, itens: [] },
  { id: 3, nome: "Marmita 04", status: "aguardando", total: 0, itens: [] },
  { id: 4, nome: "Marmita 05", status: "aguardando", total: 0, itens: [] },
];

const mesasIniciais = [
  { id: 0, nome: "Venda Rápida", status: "rápida", total: 0, itens: [] },
  { id: 1, nome: "Mesa 01", status: "ocupada", total: 25.5, itens: [{ id: 1, nome: "Bife Acebolado", preco: 25.5, quantidade: 1 }] },
  { id: 2, nome: "Mesa 02", status: "livre", total: 0, itens: [] },
  { id: 3, nome: "Mesa 03", status: "aguardando", total: 45.0, itens: [{ id: 3, nome: "Água sem Gás", preco: 4.5, quantidade: 10 }] },
  { id: 4, nome: "Mesa 04", status: "livre", total: 0, itens: [] },
  { id: 5, nome: "Mesa 05", status: "ocupada", total: 30.0, itens: [{ id: 2, nome: "Lasanha Bolonhesa", preco: 30.0, quantidade: 1 }] },
];

export default function Vendas() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [desconto, setDesconto] = useState(0);
  const [abaAtiva, setAbaAtiva] = useState("Venda Rápida");
  const [mesas, setMesas] = useState(mesasIniciais);
  const [mesaAtiva, setMesaAtiva] = useState(0);
  const [marmitas, setMarmitas] = useState(marmitasIniciais);
  const [marmitaAtiva, setMarmitaAtiva] = useState(null);
  const [metodoPagamentoAtivo, setMetodoPagamentoAtivo] = useState("dinheiro");

  const mesaAtual = mesas.find((m) => m.id === mesaAtiva);
  const marmitaAtual = marmitas.find((m) => m.id === marmitaAtiva);
  const carrinhoAtual =
    abaAtiva === "Marmitas"
      ? marmitaAtual
        ? marmitaAtual.itens
        : []
      : mesaAtual
        ? mesaAtual.itens
        : [];

  const subtotal = carrinhoAtual.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const total = subtotal - (subtotal * desconto) / 100;

  const produtosFiltrados = categoriaAtiva === "Todos" ? produtosExemplo : produtosExemplo.filter((p) => p.categoria === categoriaAtiva);

  const atualizarCarrinho = (novoCarrinho) => {
    const novoTotal = novoCarrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

    if (abaAtiva === "Marmitas") {
      setMarmitas((m) =>
        m.map((marmita) =>
          marmita.id === marmitaAtiva
            ? { ...marmita, itens: novoCarrinho, total: novoTotal, status: novoCarrinho.length > 0 ? "aguardando" : "livre" }
            : marmita
        )
      );
    } else {
      setMesas((m) =>
        m.map((mesa) =>
          mesa.id === mesaAtiva
            ? {
              ...mesa,
              itens: novoCarrinho,
              total: novoTotal,
              status: mesa.id !== 0 && novoCarrinho.length > 0 ? "ocupada" : mesa.id !== 0 ? "livre" : "rápida",
            }
            : mesa
        )
      );
    }
  };

  const adicionarAoCarrinho = (produto) => {
    if (abaAtiva === "Gestão de Mesas" && mesaAtiva === null) return;
    if (abaAtiva === "Marmitas" && marmitaAtiva === null) return;

    const existente = carrinhoAtual.find((item) => item.id === produto.id);
    const novoCarrinho = existente
      ? carrinhoAtual.map((item) => (item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item))
      : [...carrinhoAtual, { ...produto, quantidade: 1 }];

    atualizarCarrinho(novoCarrinho);
  };

  const removerDoCarrinho = (id) => {
    const novoCarrinho = carrinhoAtual.filter((item) => item.id !== id);
    atualizarCarrinho(novoCarrinho);
  };

  const alterarQuantidade = (id, delta) => {
    const novoCarrinho = carrinhoAtual
      .map((item) => (item.id === id ? { ...item, quantidade: Math.max(item.quantidade + delta, 0) } : item))
      .filter((item) => item.quantidade > 0);
    atualizarCarrinho(novoCarrinho);
  };

  const handleFinalizarVenda = () => {
    if (carrinhoAtual.length === 0) return;

    const nomeDoPedido = abaAtiva === "Marmitas" ? marmitaAtual?.nome : mesaAtual?.nome || "Venda Rápida";
    console.log(`Finalizando: ${nomeDoPedido}. Total: R$ ${total.toFixed(2)}. Pagamento: ${metodoPagamentoAtivo}.`);

    if (abaAtiva === "Gestão de Mesas" && mesaAtiva !== 0) {
      setMesas((m) => m.map((mesa) => (mesa.id === mesaAtiva ? { ...mesa, itens: [], total: 0, status: "livre" } : mesa)));
      setMesaAtiva(null);
    } else if (abaAtiva === "Marmitas" && marmitaAtiva !== null) {
      setMarmitas((m) => m.map((marmita) => (marmita.id === marmitaAtiva ? { ...marmita, itens: [], total: 0, status: "livre" } : marmita)));
      setMarmitaAtiva(null);
    } else {
      setMesas((m) => m.map((mesa) => (mesa.id === 0 ? { ...mesa, itens: [], total: 0, status: "rápida" } : mesa)));
    }

    setDesconto(0);
    setMetodoPagamentoAtivo("dinheiro");
  };

  const handleAbaChange = (aba) => {
    setAbaAtiva(aba);
    setMesaAtiva(aba === "Venda Rápida" ? 0 : null);
    setMarmitaAtiva(null);
  };

  const handleSelecionarMesa = (id) => setMesaAtiva(id);

  const isMesaSelecionada = abaAtiva === "Gestão de Mesas" && mesaAtiva !== null && mesaAtiva !== 0;
  const isMarmitaSelecionada = abaAtiva === "Marmitas" && marmitaAtiva !== null;

  return (
    <div className="vendas-container">
      <div className="receitas-area">
        <h2 className="titulo-vendas">VENDAS</h2>
        <div className="categorias-receitas">
          {categorias.map((cat) => (
            <button key={cat} className={`categoria-btn-receitas ${categoriaAtiva === cat ? "active" : ""}`} onClick={() => setCategoriaAtiva(cat)}>
              {cat}
            </button>
          ))}
        </div>

        <div className="produtos-scroll">
          <div className="grid-produtos-receitas">
            {produtosFiltrados.map((produto) => (

              <div key={produto.id} className="card-receita" style={{
                opacity: abaAtiva === "Gestão de Mesas" && !isMesaSelecionada ? 0.6 : 1,
                cursor: abaAtiva === "Gestão de Mesas" && !isMesaSelecionada ? "not-allowed" : "pointer",
              }} onClick={() => adicionarAoCarrinho(produto)}>

                <p className="nome-produto">{produto.nome}</p>
                <p className="preco-produto">Preço: R$ {produto.preco.toFixed(2)} ({produto.unidade}) </p>
                <button className="btn-add-carrinho"onClick={(e) => {e.stopPropagation();adicionarAoCarrinho(produto);}}
                  disabled={(abaAtiva === "Gestão de Mesas" && !isMesaSelecionada) || (abaAtiva === "Marmitas" && !isMarmitaSelecionada)}>
                  <img src={Plusadd} alt="icon-plus" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="carrinho-area">
        <div className="abas">
          <button className={`aba ${abaAtiva === "Venda Rápida" ? "ativa" : ""}`} onClick={() => handleAbaChange("Venda Rápida")}>Venda Rápida</button>
          <button className={`aba ${abaAtiva === "Gestão de Mesas" ? "ativa" : ""}`} onClick={() => handleAbaChange("Gestão de Mesas")}>Gestão de Mesas</button>
          <button className={`aba ${abaAtiva === "Marmitas" ? "ativa" : ""}`} onClick={() => handleAbaChange("Marmitas")}>Marmitas</button>
        </div>

        {abaAtiva === "Gestão de Mesas" && mesaAtiva === null && (
          <div className="grid-mesas-scroll">
            {mesas.filter((m) => m.id !== 0).map((mesa) => (
              <button key={mesa.id} className={`card-mesa ${mesa.status}`} onClick={() => handleSelecionarMesa(mesa.id)}>
                <img src={Mesa} className="mesa-icon" alt="mesa-icon" />
                <span className="nome-mesa">{mesa.nome}</span>
                <span className="total-mesa">R$ {mesa.total.toFixed(2)}</span>
              </button>
            ))}
          </div>
        )}

        {abaAtiva === "Marmitas" && marmitaAtiva === null && (
          <div className="grid-mesas-scroll">
            {marmitas.map((marmita) => (
              <button key={marmita.id} className={`card-mesa ${marmita.status}`} onClick={() => setMarmitaAtiva(marmita.id)}>
                <img src={Marmita} className="mesa-icon" alt="marmita-icon" />
                <span className="nome-mesa">{marmita.nome}</span>
                <span className="total-mesa">R$ {marmita.total.toFixed(2)}</span>
              </button>
            ))}
          </div>
        )}

        {(abaAtiva === "Venda Rápida" || isMesaSelecionada || isMarmitaSelecionada) && (
          <>
            <h3 className="titulo-carrinho">
              {abaAtiva === "Marmitas"
                ? marmitaAtual
                  ? marmitaAtual.nome
                  : "Selecione uma Marmita"
                : mesaAtual
                  ? mesaAtual.nome
                  : "Selecione uma Mesa"}
            </h3>

            <div className="lista-carrinho">
              {carrinhoAtual.length === 0 ? (
                <p className="text-center text-gray-500 italic mt-5">
                  {abaAtiva === "Venda Rápida"
                    ? "Inicie uma nova venda."
                    : abaAtiva === "Gestão de Mesas"
                      ? "Mesa Livre. Adicione itens."
                      : "Marmita Livre. Adicione itens."}
                </p>
              ) : (
                carrinhoAtual.map((item) => (
                  <div key={item.id} className="item-carrinho">
                    <span>{item.nome}</span>
                    <div className="controles">
                      <button onClick={() => alterarQuantidade(item.id, 1)}>
                        <img src={Plus} alt="icon-plus" />
                      </button>
                      <span>{item.quantidade}</span>
                      <button onClick={() => alterarQuantidade(item.id, -1)}>
                        <img src={Minus} alt="icon-minus" />
                      </button>
                    </div>
                    <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                    <img className="lixo-icon" src={Lixo} alt="lixo" onClick={() => removerDoCarrinho(item.id)} />
                  </div>
                ))
              )}
            </div>

            <div className="resumo">
              <p>Subtotal: <span>R$ {subtotal.toFixed(2)}</span></p>
              <p> Desconto (%):{" "} <input type="number" value={desconto} onChange={(e) => setDesconto(Number(e.target.value))} /></p>
              <h3>Total a Pagar: <span>R$ {total.toFixed(2)}</span></h3>
            </div>

            <div className="pagamentos">
              <button className={metodoPagamentoAtivo === "dinheiro" ? "active-pagamento" : ""} onClick={() => setMetodoPagamentoAtivo("dinheiro")}>
                <img src={Dinheiro} alt="icon-Dinheiro" className="dinheiro" />
              </button>

              <button className={metodoPagamentoAtivo === "cartao" ? "active-pagamento" : ""} onClick={() => setMetodoPagamentoAtivo("cartao")}>
                <img src={Cartao} alt="icon-Cartao" className="cartao" />
              </button>

              <button className={metodoPagamentoAtivo === "pix" ? "active-pagamento" : ""} onClick={() => setMetodoPagamentoAtivo("pix")}>
                <img src={PIX} alt="icon-PIX" className="pix" />
              </button>
            </div>

            <div className="pagamentos">
              <span>Dinheiro</span>
              <span>Débito/Crédito</span>
              <span>PIX</span>
            </div>

            <button className="finalizar-btn" onClick={handleFinalizarVenda}>
              {abaAtiva === "Venda Rápida" ? "Finalizar Venda" : abaAtiva === "Gestão de Mesas" ? "Fechar Conta" : "Finalizar Pedido Marmita"}
            </button>

            {isMesaSelecionada && (
              <button className="voltar-btn" onClick={() => setMesaAtiva(null)}>
                Voltar para Mesas
              </button>
            )}

            {isMarmitaSelecionada && (
              <button className="voltar-btn" onClick={() => setMarmitaAtiva(null)}>
                Voltar para Marmitas
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
