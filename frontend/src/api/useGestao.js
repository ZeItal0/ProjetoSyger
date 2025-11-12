import { useState, useEffect } from "react";
import { getSocket, conectarSocket } from "../services/socket";

export default function useGestao() {
  const [activeItem, setActiveItem] = useState("Controles");
  const [usuarios, setUsuarios] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);
  const [usuariosAtivos, setUsuariosAtivos] = useState([]);
  const [destinatario, setDestinatario] = useState("Todos os Utilizadores Ativos");
  const [mensagem, setMensagem] = useState("");
  const [historico, setHistorico] = useState([]);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        return;
      }

      const res = await fetch(
        `http://localhost:5000/usuarios/listar?page=${paginaAtual}&limit=15`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Erro ao buscar usuários");

      const data = await res.json();
      if (Array.isArray(data.registros)) {
        setUsuarios(data.registros);
        setTotalPaginas(data.totalPages || 1);
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuariosAtivos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        return;
      }

      const res = await fetch("http://localhost:5000/usuarios/ativos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao buscar usuários ativos");
      const data = await res.json();
      setUsuariosAtivos(data);
    } catch (err) {
      console.error("Erro ao carregar usuários ativos:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!destinatario || destinatario === "Todos os Utilizadores Ativos") return;

    async function carregarMensagensPorDestinatario() {
      try {
        const response = await fetch(`http://localhost:5000/mensagens/${destinatario}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Erro ao buscar mensagens");

        const data = await response.json();
        setHistorico(data);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        setHistorico([]);
      }
    }

    carregarMensagensPorDestinatario();
  }, [destinatario]);

  const handlePausarUsuario = async (usuario) => {
    if (!window.confirm(`Tem certeza que deseja pausar a conta de ${usuario.nome}?`)) return;

    try {
      const token = localStorage.getItem("token");
      const idLimpo = usuario.id.replace("#", "");

      const res = await fetch(`http://localhost:5000/usuarios/pausar/${idLimpo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao pausar usuário");

      alert(`Usuário ${usuario.nome} foi suspenso com sucesso.`);
      fetchUsuarios();
    } catch (err) {
      console.error("Erro ao pausar usuário:", err);
      alert("Erro ao pausar usuário.");
    }
  };

  const handleReativarUsuario = async (usuario) => {
    if (!window.confirm(`Deseja reativar a conta de ${usuario.nome}?`)) return;

    try {
      const token = localStorage.getItem("token");
      const idLimpo = usuario.id.replace("#", "");

      const res = await fetch(`http://localhost:5000/usuarios/reativar/${idLimpo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao reativar usuário");

      alert(`Usuário ${usuario.nome} foi reativado com sucesso.`);
      fetchUsuarios();
    } catch (err) {
      console.error("Erro ao reativar usuário:", err);
      alert("Erro ao reativar usuário.");
    }
  };

  const handleAutorizarUsuario = async (usuario) => {
    if (!window.confirm(`Deseja autorizar a conta de ${usuario.nome}?`)) return;

    try {
      const token = localStorage.getItem("token");
      const idLimpo = usuario.id.replace("#", "");

      const res = await fetch(`http://localhost:5000/usuarios/autorizar/${idLimpo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao autorizar usuário");

      alert(`Usuário ${usuario.nome} foi autorizado com sucesso.`);
      fetchUsuarios();
    } catch (err) {
      console.error("Erro ao autorizar usuário:", err);
      alert("Erro ao autorizar usuário.");
    }
  };

  const handleExcluirUsuario = async (usuario) => {
    if (!window.confirm(`Tem certeza que deseja inativar a conta de ${usuario.nome}?`)) return;

    try {
      const token = localStorage.getItem("token");
      const idLimpo = usuario.id.replace("#", "");

      const res = await fetch(`http://localhost:5000/usuarios/excluir/${idLimpo}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao excluir usuário");

      alert(`Usuário ${usuario.nome} foi inativado com sucesso.`);
      fetchUsuarios();
    } catch (err) {
      console.error("Erro ao inativar usuário:", err);
      alert("Erro ao inativar usuário.");
    }
  };

  const handleEnviarNotificacao = () => {
    let socket = getSocket();

    if (!socket || !socket.connected) {
      const token = localStorage.getItem("token");
      if (token) {
        socket = conectarSocket(token);
      } else {
        alert("Sessão expirada. Faça login novamente.");
        return;
      }
    }

    if (mensagem.trim() === "") {
      alert("A mensagem não pode estar vazia.");
      return;
    }

    if (!destinatario) {
      alert("Selecione um destinatário antes de enviar a mensagem.");
      return;
    }

    socket.emit("enviar_mensagem", { destinatario, mensagem });
    alert(`Mensagem enviada para ${destinatario}!`);
    setMensagem("");
  };


  useEffect(() => {
    fetchUsuariosAtivos();
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [paginaAtual]);

  return {
    activeItem,
    setActiveItem,
    usuarios,
    paginaAtual,
    setPaginaAtual,
    totalPaginas,
    loading,
    usuariosAtivos,
    destinatario,
    setDestinatario,
    mensagem,
    setMensagem,
    historico,
    handlePausarUsuario,
    handleReativarUsuario,
    handleAutorizarUsuario,
    handleExcluirUsuario,
    handleEnviarNotificacao,
  };
}
