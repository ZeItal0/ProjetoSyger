import { useState } from "react";
import { useInsumos } from "../api/inventario";

export function useRegistrarPrato() {
  const { itens: produtos, loading, erro } = useInsumos();

  const categorias = [ "Todos", "Carnes", "Laticínios", "Grãos", "Massas", "Gorduras", "Temperos", "Bebidas", "Congelados"
  ];

  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [ingredientes, setIngredientes] = useState([]);
  const [form, setForm] = useState({
    nome_prato: "",
    valor_base_custo: "",
    tempo_preparo: "",
    categoria: "",
  });

  const adicionarIngrediente = (produto) => {
    setIngredientes((prev) => {
      const produtoId = Number(produto.id);
      const idx = prev.findIndex((i) => Number(i.id) === produtoId);

      if (idx !== -1) {
        const novaLista = [...prev];
        novaLista[idx] = {
          ...novaLista[idx],
          quantidade: novaLista[idx].quantidade + 1,
        };
        return novaLista;
      }
      return [
        ...prev,
        {
          id: produtoId,
          nome: produto.nome,
          unidade: produto.unidadeMedida || produto.unidade || "",
          id_unidade_medida: produto.id_unidade_medida,
          quantidade: 1,
          valorMedida: produto.valorMedida || 0,
        },
      ];
    });
  };

  const removerIngrediente = (produto) => {
    setIngredientes((prev) => {
      const produtoId = Number(produto.id);
      const idx = prev.findIndex((ing) => Number(ing.id) === produtoId);
      if (idx === -1) return prev;

      const novaLista = [...prev];
      const item = novaLista[idx];
      if (item.quantidade > 1) {
        novaLista[idx] = { ...item, quantidade: item.quantidade - 1 };
        return novaLista;
      }
      return novaLista.filter((ing) => Number(ing.id) !== produtoId);
    });
  };

  const salvarPrato = async () => {
    const token = localStorage.getItem("token");

    const prato = {
      nome_prato: form.nome_prato,
      valor_base_custo: parseFloat(form.valor_base_custo),
      tempo_preparo: form.tempo_preparo,
      categoria: form.categoria,
      ingredientes: ingredientes.map((i) => ({
        id_produto: i.id,
        quantidade: i.quantidade,
        id_unidade_medida: i.id_unidade_medida,
        valor_medida: i.valorMedida,
      })),
    };

    try {
      const res = await fetch("http://localhost:5000/pratos/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(prato),
      });

      const data = await res.json();
      if (!res.ok) {
        if (Array.isArray(data.message)) {
          alert(data.message.join("\n"));
        } else {
          throw new Error(data.message || "erro ao registrar prato");
        }
        return;
      }

      alert("prato registrado com sucesso");
      setIngredientes([]);
      setForm({ nome_prato: "", valor_base_custo: "", tempo_preparo: "", categoria: "" });
    } catch (err) {
      console.error(err);
      alert("Erro: " + err.message);
    }
  };

  const produtosFiltrados =
    categoriaAtiva === "Todos"
      ? produtos
      : produtos.filter(
          (p) => p.categoria?.toLowerCase() === categoriaAtiva.toLowerCase()
        );

  return { produtos, loading, erro, categorias, categoriaAtiva, setCategoriaAtiva, ingredientes, setIngredientes, form, setForm, adicionarIngrediente, removerIngrediente, salvarPrato, produtosFiltrados, };
}
