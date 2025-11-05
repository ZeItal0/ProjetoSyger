import { useEffect, useState } from "react";

export function useGestaoCardapio() {
  const [pratos, setPratos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [pratoEmEdicao, setPratoEmEdicao] = useState(null);
  const [novoAdicional, setNovoAdicional] = useState("");

  useEffect(() => {
    const fetchPratos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/pratos/listar", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao buscar pratos");

        const data = await response.json();
        const pratosComVariacoesUnicas = data.map((p) => ({
          ...p,
          variacoes: (p.variacoes || []).map((v) => ({
            ...v,
            id_variacao: v.id_variacao || `temp-${Date.now()}-${Math.random()}`,
          })),
          adicionais: p.adicionais ? [...p.adicionais] : [],
        }));

        setPratos(pratosComVariacoesUnicas);
      } catch (err) {
        console.error("Erro ao carregar pratos:", err);
        alert("Erro ao carregar pratos. Verifique o backend.");
      } finally {
        setCarregando(false);
      }
    };

    fetchPratos();
  }, []);

  const handleEditVariacoes = (prato) => {
    const variacoesComId = (prato.variacoes || []).map((v) => ({
      ...v,
      id_variacao: v.id_variacao || `temp-${Date.now()}-${Math.random()}`,
    }));

    setPratoEmEdicao({ ...prato, variacoes: [...variacoesComId] });
    setNovoAdicional("");
  };

  const handleUpdatePratos = (pratoAtualizado) => {
    setPratos((prev) =>
      prev.map((p) =>
        p.id === pratoAtualizado.id
          ? { ...pratoAtualizado, variacoes: [...pratoAtualizado.variacoes] }
          : p
      )
    );
  };

  const handleVariacaoChange = (index, field, value) => {
    if (!pratoEmEdicao) return;
    const newVariacoes = [...pratoEmEdicao.variacoes];
    newVariacoes[index] = { ...newVariacoes[index], [field]: value };
    setPratoEmEdicao({ ...pratoEmEdicao, variacoes: newVariacoes });
  };

  const handleAddVariacao = () => {
    if (!pratoEmEdicao) return;

    const newVariacao = {
      id_variacao: `temp-${Date.now()}-${Math.random()}`,
      nome: "",
      multiplicador: 1.0,
      preco: 1.0,
    };

    setPratoEmEdicao({
      ...pratoEmEdicao,
      variacoes: [...pratoEmEdicao.variacoes, newVariacao],
    });
  };

  const handleRemoveVariacao = async (index) => {
    if (!pratoEmEdicao) return;
    const variacao = pratoEmEdicao.variacoes[index];

    if (String(variacao.id_variacao).startsWith("temp-")) {
      const newVariacoes = pratoEmEdicao.variacoes.filter((_, i) => i !== index);
      setPratoEmEdicao({ ...pratoEmEdicao, variacoes: newVariacoes });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/pratos/removerVariacao/${variacao.id_variacao}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.mensagem || "erro ao remover variação.");

      alert(data.mensagem);
      const newVariacoes = pratoEmEdicao.variacoes.filter((_, i) => i !== index);
      setPratoEmEdicao({ ...pratoEmEdicao, variacoes: newVariacoes });
    } catch (err) {
      console.error("Erro ao remover variação:", err);
      alert(err.message);
    }
  };

  const handleAddAdicional = () => {
    if (!pratoEmEdicao || !novoAdicional.trim()) return;
    const newAdicionais = [...(pratoEmEdicao.adicionais || []), novoAdicional.trim()];
    setPratoEmEdicao({ ...pratoEmEdicao, adicionais: newAdicionais });
    setNovoAdicional("");
  };

  const handleRemoveAdicional = (adicionalToRemove) => {
    if (!pratoEmEdicao) return;
    const newAdicionais = (pratoEmEdicao.adicionais || []).filter(
      (a) => a !== adicionalToRemove
    );
    setPratoEmEdicao({ ...pratoEmEdicao, adicionais: newAdicionais });
  };

  const handleSave = async () => {
    if (!pratoEmEdicao) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/pratos/salvarVariacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_prato: pratoEmEdicao.id,
          variacoes: pratoEmEdicao.variacoes.map((v) => ({
            id_variacao: String(v.id_variacao).includes("temp") ? undefined : v.id_variacao,
            nome_menu: v.nome,
            multiplicador_receita: v.multiplicador,
            preco_venda: v.preco,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.mensagem || "erro ao salvar variações");

      alert(data.mensagem);
      handleUpdatePratos(pratoEmEdicao);
      setPratoEmEdicao(null);
    } catch (err) {
      console.error("erro ao salvar variações:", err);
      alert(err.message);
    }
  };

  return {
    pratos,
    carregando,
    pratoEmEdicao,
    novoAdicional,
    setNovoAdicional,
    handleEditVariacoes,
    handleUpdatePratos,
    handleVariacaoChange,
    handleAddVariacao,
    handleRemoveVariacao,
    handleAddAdicional,
    handleRemoveAdicional,
    handleSave,
    setPratoEmEdicao,
  };
}
