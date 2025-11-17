import { useState, useEffect } from "react";

export default function useVendasRapidas() {
  const [vendas, setVendas] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const listarVendas = async () => {
      if (!token) return;

      try {
        const res = await fetch(
          `http://localhost:5000/vendas/vendas-rapidas?page=${paginaAtual}&limit=20`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("erro ao buscar vendas rápidas");

        const data = await res.json();
        setVendas(data.vendas);
        setTotalPaginas(Math.ceil(data.total / 20));
      } catch (err) {
        console.error(err);
        alert("falha ao carregar vendas.");
      }
    };

    listarVendas();
  }, [paginaAtual, token]);

  const estornarVenda = async (id_pedido) => {
    if (!token) return;

    const confirmado = window.confirm("Tem certeza que deseja estornar esta venda?");
    if (!confirmado) return;

    try {
      const res = await fetch(
        `http://localhost:5000/vendas/estornar/${id_pedido}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("erro ao estornar venda");

      alert("venda estornada com sucesso");
      setVendas((prev) => prev.filter((v) => v.id !== id_pedido));
    } catch (err) {
      console.error(err);
      alert("falha ao estornar venda.");
    }
  };

  return {
    vendas,
    setVendas,
    paginaAtual,
    setPaginaAtual,
    totalPaginas,
    estornarVenda,
  };
}
