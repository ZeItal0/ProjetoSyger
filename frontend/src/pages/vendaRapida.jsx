import React, { useState, useEffect } from "react";
import "../assets/vendas.css";
import Dinheiro from "../icons/money.png";
import Cartao from "../icons/card.png";
import PIX from "../icons/PIX.png";
import Plus from "../icons/plus.png";
import Minus from "../icons/minus.png";
import Lixo from "../icons/trash.png";
import MesaIcon from "../icons/mesa.png";
import MarmitaIcon from "../icons/marmita.png";
import Plusadd from "../icons/plusadd.png";

const categorias = ["Todos", "Carnes", "Grãos", "Massas", "Bebidas", "Sobremesas", "Lanches", "Aperitivos"];

const marmitasIniciais = [
  { id: 0, nome: "Marmita 01", status: "aguardando", total: 0, itens: [] },
  { id: 1, nome: "Marmita 02", status: "aguardando", total: 0, itens: [] },
  { id: 2, nome: "Marmita 03", status: "aguardando", total: 0, itens: [] },
  { id: 3, nome: "Marmita 04", status: "aguardando", total: 0, itens: [] },
  { id: 4, nome: "Marmita 05", status: "aguardando", total: 0, itens: [] },
];

export default function Vendas() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState("Venda Rápida");
  const [vendaRapidaItens, setVendaRapidaItens] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [mesaAtiva, setMesaAtiva] = useState(null);
  const [marmitas, setMarmitas] = useState(marmitasIniciais);
  const [marmitaAtiva, setMarmitaAtiva] = useState(null);
  const [metodoPagamentoAtivo, setMetodoPagamentoAtivo] = useState("dinheiro");
  const [desconto, setDesconto] = useState(0);
  const [salvandoVenda, setSalvandoVenda] = useState(false);
  const carrinhoVendaRapida = vendaRapidaItens;
  const mesaAtual = mesas.find((m) => m.id === mesaAtiva) || null;
  const marmitaAtual = marmitas.find((m) => m.id === marmitaAtiva) || null;

  const carrinhoAtual =
    abaAtiva === "Marmitas"
      ? marmitaAtual?.itens ?? []
      : abaAtiva === "Gestão de Mesas"
        ? mesaAtual?.itens ?? []
        : carrinhoVendaRapida;

  const subtotal = carrinhoAtual.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const total = subtotal - (subtotal * desconto) / 100;

  const atualizarVendaRapida = (novoCarrinho) => {
    setVendaRapidaItens(novoCarrinho);
  };

  const atualizarMesaItensLocal = (mesaId, novoCarrinho) => {
    setMesas((prev) => prev.map((m) => m.id === mesaId ? { ...m, itens: novoCarrinho, total: novoCarrinho.reduce((a, it) => a + (it.preco_unitario ?? it.preco ?? 0) * it.quantidade, 0), status: novoCarrinho.length ? "aberta" : "fechada", } : m ) );
  };


  const atualizarMarmitaItensLocal = (marmitaId, novoCarrinho) => {
    setMarmitas((prev) =>
      prev.map((m) =>
        m.id === marmitaId
          ? {
            ...m,
            itens: novoCarrinho,
            total: novoCarrinho.reduce(
              (acc, it) =>
                acc + (it.preco_unitario ?? it.preco ?? 0) * it.quantidade,
              0
            ),
            status: novoCarrinho.length ? "em_espera" : "finalizado",
          }
          : m
      )
    );
  };



  const adicionarAoCarrinho = (produto) => {

    if (abaAtiva === "Gestão de Mesas") {
      if (!mesaAtiva) {
        alert("Selecione uma mesa antes de adicionar itens.");
        return;
      }
      const existente = (mesaAtual?.itens || []).find((it) => it.id === produto.id);
      const novoCarrinho = existente
        ? (mesaAtual.itens || []).map((it) => (it.id === produto.id ? { ...it, quantidade: it.quantidade + 1 } : it))
        : [...(mesaAtual.itens || []), { ...produto, quantidade: 1 }];
      atualizarMesaItensLocal(mesaAtiva, novoCarrinho);
      return;
    }

    if (abaAtiva === "Marmitas") {
      if (marmitaAtiva === null) {
        alert("Selecione uma marmita antes de adicionar itens.");
        return;
      }
      const existente = (marmitaAtual?.itens || []).find((it) => it.id === produto.id);
      const novoCarrinho = existente
        ? (marmitaAtual.itens || []).map((it) => (it.id === produto.id ? { ...it, quantidade: it.quantidade + 1 } : it))
        : [...(marmitaAtual.itens || []), { ...produto, quantidade: 1 }];
      atualizarMarmitaItensLocal(marmitaAtiva, novoCarrinho);
      return;
    }

    const existente = vendaRapidaItens.find((it) => it.id === produto.id);
    const novoCarrinho = existente ? vendaRapidaItens.map((it) => (it.id === produto.id ? { ...it, quantidade: it.quantidade + 1 } : it)) : [...vendaRapidaItens, { ...produto, quantidade: 1 }];
    atualizarVendaRapida(novoCarrinho);
  };

  const removerDoCarrinho = (id) => {
    if (abaAtiva === "Gestão de Mesas") {
      if (!mesaAtual) return;
      const novoCarrinho = (mesaAtual.itens || []).filter((it) => it.id !== id);
      atualizarMesaItensLocal(mesaAtiva, novoCarrinho);
      return;
    }
    if (abaAtiva === "Marmitas") {
      if (!marmitaAtual) return;
      const novoCarrinho = (marmitaAtual.itens || []).filter((it) => it.id !== id);
      atualizarMarmitaItensLocal(marmitaAtiva, novoCarrinho);
      return;
    }

    const novoCarrinho = vendaRapidaItens.filter((it) => it.id !== id);
    atualizarVendaRapida(novoCarrinho);
  };

  const alterarQuantidade = (id, delta) => {
    if (abaAtiva === "Gestão de Mesas") {
      if (!mesaAtual) return;
      const novoCarrinho = (mesaAtual.itens || [])
        .map((it) => (it.id === id ? { ...it, quantidade: Math.max(it.quantidade + delta, 0) } : it))
        .filter((it) => it.quantidade > 0);
      atualizarMesaItensLocal(mesaAtiva, novoCarrinho);
      return;
    }
    if (abaAtiva === "Marmitas") {
      if (!marmitaAtual) return;
      const novoCarrinho = (marmitaAtual.itens || [])
        .map((it) => (it.id === id ? { ...it, quantidade: Math.max(it.quantidade + delta, 0) } : it))
        .filter((it) => it.quantidade > 0);
      atualizarMarmitaItensLocal(marmitaAtiva, novoCarrinho);
      return;
    }

    const novoCarrinho = vendaRapidaItens
      .map((it) => (it.id === id ? { ...it, quantidade: Math.max(it.quantidade + delta, 0) } : it))
      .filter((it) => it.quantidade > 0);
    atualizarVendaRapida(novoCarrinho);
  };

  useEffect(() => {
    const carregarCardapio = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/cardapio/cardapio-dia/ativo", {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (!res.ok) throw new Error("Erro ao buscar cardápio ativo");
        const data = await res.json();
        setProdutos(data.pratos || []);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar o cardápio");
      } finally {
        setLoading(false);
      }
    };

    carregarCardapio();
  }, []);

  useEffect(() => {
    const carregarMesas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/vendas/mesas/abertas", {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const dados = await res.json();

        setMesas(dados);

        if (mesaAtiva) {
          const mesa = dados.find(m => m.id === mesaAtiva);
          if (mesa) setMesaAtual(mesa);
          else setMesaAtiva(null);
        }

      } catch (err) {
        console.error("Erro carregarMesas:", err);
      }
    };

    carregarMesas();
  }, []);

  const handleCriarMarmita = async () => {
    const numero = prompt("Número da marmita:");
    if (!numero) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/vendas/marmitas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ numero_marmita: numero }),
      });

      const dados = await res.json();

      if (!res.ok) {
        throw new Error(dados.erro || "Erro ao criar marmita");
      }

      setMarmitas((prev) => [
        ...prev,
        {
          id: dados.id_marmita,
          nome: `Marmita ${dados.numero_marmita}`,
          status: dados.status.toLowerCase(),
          total: dados.total,
          itens: [],
        },
      ]);

    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const carregarMarmitas = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/vendas/listar/marmitas", {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const dados = await res.json();
        setMarmitas(dados);
        if (marmitaAtiva) {
          const marmita = dados.find(m => m.id_marmita === marmitaAtiva);
          if (marmita) {
            setMarmitaAtual(marmita);
          } else {
            setMarmitaAtiva(null);
          }
        }
      } catch (err) {
        console.error("Erro carregarMarmitas:", err);
      }
    };
    carregarMarmitas();
  }, []);



  const handleCriarMesa = async () => {
    const numero = prompt("Número da mesa:");
    if (!numero) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/vendas/mesas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ numero_mesa: numero }),
      });
      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.erro || "Erro ao criar mesa");
      }

      const mesaNova = await res.json();
      setMesas((prev) => [
        ...prev,
        {
          id: mesaNova.id_mesa,
          numero_mesa: mesaNova.numero_mesa,
          nome: `Mesa ${mesaNova.numero_mesa}`,
          status: (mesaNova.status || "aberta").toLowerCase(),
          total: 0,
          itens: [],
        },
      ]);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const adicionarItemAMesa = async (produto) => {
    if (!mesaAtiva) {
      alert("Selecione uma mesa antes de adicionar itens.");
      return;
    }

    const itemParaMesa = {
      id_prato: produto.id_prato || null,
      id_variacao: produto.id_variacao || null,
      id_produto: produto.id_produto || null,
      quantidade: 1,
      preco_unitario: produto.preco ?? produto.preco_unitario ?? 0,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/vendas/mesas/${mesaAtiva}/adicionar-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(itemParaMesa),
      });

      if (!res.ok) throw new Error("Erro ao adicionar item à mesa");

      const itemAdicionado = await res.json();

      const novoCarrinho = [...(mesaAtual.itens || []), {
        id: itemAdicionado.id_item_pedido,
        id_prato: itemAdicionado.id_prato,
        id_produto: itemAdicionado.id_produto,
        id_variacao: itemAdicionado.id_variacao,
        nome: produto.nome,
        preco_unitario: parseFloat(itemAdicionado.preco_unitario),
        quantidade: parseFloat(itemAdicionado.quantidade)
      }];

      atualizarMesaItensLocal(mesaAtiva, novoCarrinho);

    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar item à mesa");
    }
  };

  const adicionarItemAMarmita = async (produto) => {
    if (!marmitaAtiva) {
      alert("Selecione uma marmita antes de adicionar itens.");
      return;
    }

    const itemParaMarmita = {
      id_prato: produto.id_prato || null,
      id_variacao: produto.id_variacao || null,
      id_produto: produto.id_produto || null,
      quantidade: 1,
      preco_unitario: produto.preco ?? 0,
    };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/vendas/marmitas/${marmitaAtiva}/adicionar-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(itemParaMarmita),
      });

      if (!res.ok) throw new Error("Erro ao adicionar item à marmita");

      const itemAdicionado = await res.json();

      const novoCarrinho = [
        ...(marmitaAtual.itens || []),
        {
          id: itemAdicionado.id_item_pedido,
          id_prato: itemAdicionado.id_prato,
          id_produto: itemAdicionado.id_produto,
          id_variacao: itemAdicionado.id_variacao,
          nome: produto.nome,
          preco_unitario: parseFloat(itemAdicionado.preco_unitario),
          quantidade: parseFloat(itemAdicionado.quantidade),
        },
      ];

      atualizarMarmitaItensLocal(marmitaAtiva, novoCarrinho);

    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar item à marmita");
    }
  };


  const atualizarMesaItensLocalRemover = (mesaId, idItemRemover) => {
    setMesas((prev) =>
      prev.map((mesa) =>
        mesa.id === mesaId
          ? {
            ...mesa,
            itens: mesa.itens.filter((it) => it.id !== idItemRemover),
            total: mesa.itens
              .filter((it) => it.id !== idItemRemover)
              .reduce((acc, it) => acc + (it.preco_unitario ?? it.preco ?? 0) * it.quantidade, 0),
            status:
              mesa.itens.filter((it) => it.id !== idItemRemover).length > 0
                ? "Aberta"
                : "Fechada",
          }
          : mesa
      )
    );
  };

  const atualizarMarmitaItensLocalRemover = (marmitaId, idItem) => {
    setMarmitas(prev =>
      prev.map(m =>
        m.id === marmitaId
          ? {
            ...m,
            itens: m.itens.filter(it => it.id !== idItem),
            total: m.itens
              .filter(it => it.id !== idItem)
              .reduce(
                (acc, it) =>
                  acc + (it.preco_unitario ?? it.preco ?? 0) * it.quantidade,
                0
              )
          }
          : m
      )
    );
  };


  const removerItemMesa = async (idItem, mesaId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/vendas/mesas/${mesaId}/remover-item/${idItem}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      if (!res.ok) throw new Error("Erro ao remover item da mesa");

      atualizarMesaItensLocalRemover(mesaId, idItem);
    } catch (err) {
      console.error(err);
      alert("Erro ao remover item da mesa");
    }
  };

  const removerItemMarmita = async (idItem, marmitaId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/vendas/marmitas/${marmitaId}/remover-item/${idItem}`,
        {
          method: "DELETE",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        }
      );

      if (!res.ok) throw new Error("Erro ao remover item da marmita");

      atualizarMarmitaItensLocalRemover(marmitaId, idItem);

    } catch (err) {
      console.error(err);
      alert("Erro ao remover item da marmita");
    }
  };


  const handleFinalizarMesa = async (mesaId) => {
    if (!mesaAtual || carrinhoAtual.length === 0) return alert("Mesa sem itens para finalizar");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/vendas/mesas/${mesaId}/finalizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ forma_pagamento: metodoPagamentoAtivo }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.erro || "Erro ao finalizar mesa");
      }

      const data = await res.json();
      alert("Mesa finalizada com sucesso!");

      atualizarMesaItensLocal(mesaId, []);
      setMesaAtiva(null);

      setTimeout(() => {
        setMesas(prevMesas => prevMesas.filter(m => m.id !== mesaId));
      }, 3000);


    } catch (err) {
      console.error(err);
      alert(`Erro ao finalizar mesa: ${err.message || err}`);
    }
  };

  const handleFinalizarMarmita = async (marmitaId) => {
    if (!marmitaAtual || carrinhoAtual.length === 0)
      return alert("Marmita sem itens para finalizar");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/vendas/marmitas/${marmitaId}/finalizar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ forma_pagamento: metodoPagamentoAtivo }),
        }
      );

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.erro || "Erro ao finalizar marmita");
      }

      const data = await res.json();
      alert("Marmita finalizada com sucesso!");
      atualizarMarmitaItensLocal(marmitaId, []);
      setMarmitaAtiva(null);
      setTimeout(() => {
        setMarmitas((prev) => prev.filter((m) => m.id !== marmitaId));
      }, 3000);

    } catch (err) {
      console.error(err);
      alert(`Erro ao finalizar marmita: ${err.message || err}`);
    }
  };




  const handleFinalizarVenda = async () => {
    if (carrinhoAtual.length === 0) return alert("Carrinho vazio.");
    if (salvandoVenda) return;
    setSalvandoVenda(true);

    try {
      const payload = {
        tipo_venda: abaAtiva === "Marmitas" ? "Marmita" : abaAtiva === "Gestão de Mesas" ? "Mesa" : "Venda_Rapida",
        forma_pagamento: metodoPagamentoAtivo === "pix" ? "Pix" : metodoPagamentoAtivo === "cartao" ? "Cartao" : "Dinheiro",
        subtotal: Number(subtotal.toFixed(2)),
        desconto_percentual: Number(desconto),
        total_liquido: Number(total.toFixed(2)),
        id_mesa: abaAtiva === "Gestão de Mesas" ? mesaAtiva : null,
        itens: carrinhoAtual.map((it) => ({ id_variacao: it.id, quantidade: it.quantidade, preco_unitario: it.preco })),
      };

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/vendas/finalizar", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = "Erro ao registrar venda";
        try {
          const j = await res.json();
          msg = j.erro || j.message || msg;
        } catch (e) { }
        throw new Error(msg);
      }

      const data = await res.json();
      console.log("Venda registrada:", data);
      alert("Venda registrada com sucesso!");

      if (abaAtiva === "Gestão de Mesas" && mesaAtiva) {
        atualizarMesaItensLocal(mesaAtiva, []);
        setMesaAtiva(null);
      } else if (abaAtiva === "Marmitas" && marmitaAtiva !== null) {
        atualizarMarmitaItensLocal(marmitaAtiva, []);
        setTimeout(() => { setMarmitaAtiva(null); }, 100);
      } else {
        setVendaRapidaItens([]);
      }
      setDesconto(0);
      setMetodoPagamentoAtivo("dinheiro");
    } catch (err) {
      console.error(err);
      alert(`Erro ao finalizar venda: ${err.message || err}`);
    } finally {
      setSalvandoVenda(false);
    }
  };

  const handleAbaChange = (aba) => {
    setAbaAtiva(aba);
    if (aba === "Venda Rápida") {
      setMesaAtiva(null);
      setMarmitaAtiva(null);
    }
    if (aba === "Gestão de Mesas") {
      setMarmitaAtiva(null);
    }
    if (aba === "Marmitas") {
      setMesaAtiva(null);
    }
  };

  const obterTotalMesa = (mesa) => {
    if (!mesa) return "0.00";
    const totalCalculado = (mesa.itens || []).reduce(
      (a, it) => a + (it.preco_unitario ?? it.preco ?? 0) * it.quantidade,
      0
    );
    return totalCalculado.toFixed(2);
  };

  const totalComDescontoMesa = (mesa) => {
    if (!mesa) return 0;
    const subtotal = (mesa.itens || []).reduce((a, it) => a + (it.preco_unitario ?? it.preco ?? 0) * it.quantidade, 0);
    return subtotal - (subtotal * desconto) / 100;
  };

  const obterTotalMarmita = (marmita) => {
    if (!marmita) return 0;

    return (marmita.itens || []).reduce(
      (acc, it) => acc + (it.preco_unitario ?? it.preco ?? 0) * it.quantidade,
      0
    );
  };
  const totalComDescontoMarmita = (marmita) => {
    const subtotal = obterTotalMarmita(marmita);
    return subtotal - (subtotal * desconto) / 100;
  };



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
          {loading ? (
            <p>Carregando cardapio</p>
          ) : erro ? (
            <p className="text-red-500">{erro}</p>
          ) : (
            <div className="grid-produtos-receitas">
              {(categoriaAtiva === "Todos" ? produtos : produtos.filter((p) => p.categoria === categoriaAtiva)).map((produto) => (
                <div
                  key={produto.id_cardapio_prato ?? produto.id_variacao ?? produto.id}
                  className="card-receita"
                >
                  <p className="nome-produto">{produto.nome_prato ?? produto.nome}</p>
                  <p className="preco-produto">
                    R$ {(produto.preco ?? produto.preco_unitario ?? 0).toFixed(2)} {produto.variacao ? `(${produto.variacao})` : ""}
                  </p>

                  {abaAtiva === "Venda Rápida" && (
                    <button
                      className="btn-add-carrinho"
                      onClick={(e) => {
                        e.stopPropagation();
                        adicionarAoCarrinho({
                          id: produto.id_variacao ?? produto.id,
                          nome: produto.nome_prato ?? produto.nome,
                          preco: produto.preco ?? produto.preco_unitario ?? 0,
                          categoria: produto.categoria ?? produto.categoria_prato ?? "Outros",
                          unidade: "porção",
                        });
                      }}
                    >
                      <img src={Plusadd} alt="icon-plus" />
                    </button>
                  )}

                  {abaAtiva === "Gestão de Mesas" && mesaAtiva !== null && (
                    <button
                      className="btn-add-carrinho"
                      onClick={(e) => {
                        e.stopPropagation();
                        adicionarItemAMesa({
                          id_prato: produto.id_prato,
                          id_variacao: produto.id_variacao,
                          id_produto: produto.id,
                          preco: produto.preco ?? produto.preco_unitario ?? 0,
                          nome: produto.nome_prato ?? produto.nome,
                        });
                      }}
                    >
                      <img src={Plusadd} alt="icon-plus" />
                    </button>
                  )}

                  {abaAtiva === "Marmitas" && marmitaAtiva !== null && (
                    <button
                      className="btn-add-carrinho"
                      onClick={(e) => {
                        e.stopPropagation();
                        adicionarItemAMarmita({
                          id_prato: produto.id_prato,
                          id_variacao: produto.id_variacao,
                          id_produto: produto.id,
                          preco: produto.preco ?? produto.preco_unitario ?? 0,
                          nome: produto.nome_prato ?? produto.nome,
                        });
                      }}
                    >
                      <img src={Plusadd} alt="icon-plus" />
                    </button>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="carrinho-area">
        <div className="abas">
          <button className={`aba ${abaAtiva === "Venda Rápida" ? "ativa" : ""}`} onClick={() => handleAbaChange("Venda Rápida")}>
            Venda Rápida
          </button>
          <button className={`aba ${abaAtiva === "Gestão de Mesas" ? "ativa" : ""}`} onClick={() => handleAbaChange("Gestão de Mesas")}>
            Gestão de Mesas
          </button>
          <button className={`aba ${abaAtiva === "Marmitas" ? "ativa" : ""}`} onClick={() => handleAbaChange("Marmitas")}>
            Marmitas
          </button>
        </div>

        {abaAtiva === "Gestão de Mesas" && mesaAtiva === null && (
          <div className="mesas-container">
            <div className="grid-mesas-scroll">
              {mesas.length === 0 ? (
                <p className="text-center">Nenhuma mesa aberta.</p>
              ) : (
                mesas.map((mesa) => (
                  <button
                    key={mesa.id}
                    className={`card-mesa ${mesa.status ?? ""}`}
                    onClick={() => setMesaAtiva(mesa.id)}
                  >
                    <img src={MesaIcon} className="mesa-icon" alt="mesa-icon" />
                    <span className="nome-mesa">{mesa.nome}</span>
                    <span className="total-mesa">R$ {obterTotalMesa(mesa)}</span>
                  </button>
                ))
              )}
            </div>

            <button className="btnCriarMesa" onClick={handleCriarMesa}> Criar Mesa </button>
          </div>
        )}

        {abaAtiva === "Marmitas" && marmitaAtiva === null && (
          <div className="mesas-container">
            <div className="grid-mesas-scroll">
              {marmitas.length === 0 ? (
                <p className="text-center">Nenhuma marmita aberta.</p>
              ) : (
                marmitas.map((m) => (
                  <button
                    key={m.id}
                    className={`card-mesa ${m.status ?? ""}`}
                    onClick={() => setMarmitaAtiva(m.id)}
                  >
                    <img src={MarmitaIcon} className="mesa-icon" alt="marmita-icon" />
                    <span className="nome-mesa">{m.nome}</span>
                    <span className="total-mesa">R$ {(m.total ?? 0).toFixed(2)}</span>
                  </button>
                ))
              )}
            </div>

            <button className="btnCriarMesa" onClick={handleCriarMarmita}>Criar Marmita</button>
          </div>
        )}


        {(abaAtiva === "Venda Rápida" || mesaAtiva !== null || marmitaAtiva !== null) && (
          <>
            <h3 className="titulo-carrinho">
              {abaAtiva === "Marmitas" ? (marmitaAtual ? marmitaAtual.nome : "Selecione uma Marmita") : abaAtiva === "Gestão de Mesas" ? (mesaAtual ? mesaAtual.nome : "Selecione uma Mesa") : "Venda Rápida"}
            </h3>

            <div className="lista-carrinho">
              {carrinhoAtual.length === 0 ? (
                <p className="text-center text-gray-500 italic mt-5">
                  {abaAtiva === "Venda Rápida" ? "Inicie uma nova venda." : abaAtiva === "Gestão de Mesas" ? "Mesa Livre. Adicione itens." : "Marmita Livre. Adicione itens."}
                </p>
              ) : (
                carrinhoAtual.map((item) => (
                  <div key={item.id} className="item-carrinho">
                    <span>{item.nome}</span>
                    <div className="controles">
                      {abaAtiva === "Venda Rápida" && (
                        <button onClick={() => alterarQuantidade(item.id, 1)}>
                          <img src={Plus} alt="icon-plus" />
                        </button>
                      )}
                      <span>{item.quantidade}</span>
                      {abaAtiva === "Venda Rápida" && (
                        <button onClick={() => alterarQuantidade(item.id, -1)}>
                          <img src={Minus} alt="icon-minus" />
                        </button>
                      )}
                    </div>
                    <span>R$ {((item.preco_unitario ?? item.preco ?? 0)).toFixed(2)}</span>
                    {abaAtiva === "Venda Rápida" && (
                      <img className="lixo-icon" src={Lixo} alt="lixo" onClick={() => removerDoCarrinho(item.id)} />
                    )}
                    {abaAtiva === "Gestão de Mesas" && mesaAtiva !== null && (
                      <img className="lixo-icon" src={Lixo} alt="lixo" onClick={() => removerItemMesa(item.id, mesaAtiva)} />
                    )}
                    {abaAtiva === "Marmitas" && marmitaAtiva !== null && (
                      <img className="lixo-icon" src={Lixo} alt="lixo" onClick={() => removerItemMarmita(item.id, marmitaAtiva)} />
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="resumo">
              <p>Subtotal: <span>R$ {abaAtiva === "Gestão de Mesas" ? obterTotalMesa(mesaAtual) : abaAtiva === "Marmitas" ? obterTotalMarmita(marmitaAtual).toFixed(2) : subtotal.toFixed(2)}</span></p>
              <p>Desconto (%):{" "}<input type="number" min={0} max={100} value={desconto} onChange={(e) => setDesconto(Number(e.target.value || 0))} /></p>
              <h3>Total a Pagar: <span>R$ {abaAtiva === "Gestão de Mesas" ? totalComDescontoMesa(mesaAtual).toFixed(2) : abaAtiva === "Marmitas" ? totalComDescontoMarmita(marmitaAtual).toFixed(2) : total.toFixed(2)}</span></h3>
            </div>


            <div className="pagamentos">
              <button className={metodoPagamentoAtivo === "dinheiro" ? "active-pagamento" : ""} onClick={() => setMetodoPagamentoAtivo("dinheiro")}> <img src={Dinheiro} alt="icon-Dinheiro" className="dinheiro" /></button>
              <button className={metodoPagamentoAtivo === "cartao" ? "active-pagamento" : ""} onClick={() => setMetodoPagamentoAtivo("cartao")}> <img src={Cartao} alt="icon-Cartao" className="cartao" /></button>
              <button className={metodoPagamentoAtivo === "pix" ? "active-pagamento" : ""} onClick={() => setMetodoPagamentoAtivo("pix")}> <img src={PIX} alt="icon-PIX" className="pix" /></button>
            </div>

            <div className="pagamentos">
              <span>Dinheiro</span>
              <span>Débito/Crédito</span>
              <span>PIX</span>
            </div>

            {abaAtiva === "Venda Rápida" && (
              <button className="finalizar-btn" onClick={handleFinalizarVenda} disabled={salvandoVenda}>Finalizar Venda</button>
            )}

            {abaAtiva === "Gestão de Mesas" && mesaAtiva !== null && (
              <button className="finalizar-btn" onClick={() => handleFinalizarMesa(mesaAtiva)}>Fechar Conta</button>
            )}

            {abaAtiva === "Marmitas" && (
              <button className="finalizar-btn" onClick={() => handleFinalizarMarmita(marmitaAtiva)}>Finalizar Marmitas</button>
            )}

            {abaAtiva === "Gestão de Mesas" && mesaAtiva !== null && (
              <button className="voltar-btn" onClick={() => setMesaAtiva(null)}> Voltar para Mesas</button>
            )}

            {abaAtiva === "Marmitas" && marmitaAtiva !== null && (
              <button className="voltar-btn" onClick={() => setMarmitaAtiva(null)}> Voltar para Marmitas</button>
            )}
          </>
        )}
      </div>
    </div>
  );
}