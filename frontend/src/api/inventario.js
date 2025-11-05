import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:5000/cadastroProduto";

export const useInsumos = () => {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const token = localStorage.getItem("token");

  const carregarInsumos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/insumos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao carregar insumos");
      const data = await response.json();

      setItens(data.map(p => ({
        id: p.id_produto,
        nome: p.nome_produto,
        quantidade: Number(p.quantidade_atual),
        quantidade_minima: Number(p.quantidade_minima) || 0,
        quantidade_maxima: Number(p.quantidade_maxima) || 0,
        categoria: p.categoria?.nome_categoria || "",
        unidadeMedida: p.unidade?.nome_unidade || "",
        id_unidade_medida: p.unidade?.id_unidade_medida || 1,
        forma_compra: p.forma_compra || "",
        validade: p.validade ? new Date(p.validade).toISOString().split("T")[0] : "",
        valorTotal: p.custo_unitario ? `R$ ${Number(p.custo_unitario).toFixed(2)}` : "R$ 0,00",
        fornecedor: p.fornecedores.length > 0 ? p.fornecedores[0].fornecedor.nome_empresa : "Sem fornecedor",
        dataRegistro: new Date(p.data_cadastro).toLocaleDateString()
      })));
    } catch (error) {
      console.error(error);
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  const atualizarInsumo = async (id, dadosAtualizados) => {
    try {
      const response = await fetch(`${BASE_URL}/insumo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosAtualizados),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.message && Array.isArray(data.message)) throw new Error(data.message.join("\n"));
        throw new Error("Erro ao atualizar insumo.");
      }

      setItens(prev => prev.map(item => item.id === id ? { ...item, ...dadosAtualizados } : item));
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const excluirInsumo = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/insumo/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao excluir insumo");

      setItens(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    carregarInsumos();
  }, []);

  return { itens, loading, erro, carregarInsumos, atualizarInsumo, excluirInsumo };
};
