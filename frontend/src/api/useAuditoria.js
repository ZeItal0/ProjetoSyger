import { useEffect, useState } from "react";

export function useAuditoria() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroAcao, setFiltroAcao] = useState("Todas as ações");
  const [filtroUsuario, setFiltroUsuario] = useState("Todos os utilizadores");
  const [filtroData, setFiltroData] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

 const fetchHistorico = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("token nao encontrado");
      setLoading(false);
      return;
    }

    const res = await fetch(
      `http://localhost:5000/auditoria/listar?page=${paginaAtual}&limit=50`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      console.error("erro na resposta da API:", res.status, res.statusText);
      setLoading(false);
      return;
    }

    const data = await res.json();

    if (Array.isArray(data.registros)) {
      setHistorico(data.registros);
      setTotalPaginas(data.totalPages || 1);
    } else {
      setHistorico([]);
    }
  } catch (err) {
    console.error("erro ao carregar historico:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchHistorico();
  }, [paginaAtual]);

  const historicoFiltrado = historico.filter((item) => {
    const acaoMatch =
      filtroAcao === "Todas as ações" ||
      item.acao.toLowerCase() === filtroAcao.toLowerCase();

    const usuarioMatch =
      filtroUsuario === "Todos os utilizadores" || item.usuario === filtroUsuario;

    const dataMatch =
      !filtroData ||
      item.data === new Date(filtroData).toLocaleDateString("pt-BR");

    return acaoMatch && usuarioMatch && dataMatch;
  });

  const usuariosUnicos = [
    "Todos os utilizadores",
    ...new Set(historico.map((item) => item.usuario)),
  ];

  return {
    historicoFiltrado,
    usuariosUnicos,
    loading,
    filtroAcao,
    filtroUsuario,
    filtroData,
    setFiltroAcao,
    setFiltroUsuario,
    setFiltroData,
    paginaAtual,
    setPaginaAtual,
    totalPaginas,
  };
}
