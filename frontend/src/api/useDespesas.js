import { useEffect, useState } from "react";

export function useDespesas() {

    const [descricao, setDescricao] = useState("");
    const [valorOriginal, setValorOriginal] = useState("");
    const [dataVencimento, setDataVencimento] = useState("");
    const [fornecedor, setFornecedor] = useState("");
    const [categoria, setCategoria] = useState("");
    const [statusDivida, setStatusDivida] = useState("");
    const [dataPagamento, setDataPagamento] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("");
    const [filtroMesAno, setFiltroMesAno] = useState("");
    const [fornecedores, setFornecedores] = useState([]);
    const [contas, setContas] = useState([]);

    useEffect(() => {
        const fetchFornecedores = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:5000/cadastro/Listarfornecedores", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Erro ao buscar fornecedores");
                const data = await response.json();
                setFornecedores(data);
            } catch (error) {
                console.error("Erro ao carregar fornecedores:", error);
            }
        };
        fetchFornecedores();
    }, []);

    useEffect(() => {
        const fetchDespesas = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:5000/despesas/listar", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Erro ao buscar despesas");

                const data = await response.json();

                const despesasConvertidas = data.map((d) => ({
                    id: d.id_despesa,
                    descricao: d.descricao,
                    fornecedorNome: d.fornecedor,
                    fornecedor: d.fornecedor,
                    vencimento: d.data_vencimento?.split("T")[0],
                    valor: parseFloat(d.valor_original),
                    status: d.status_divida,
                    categoria: d.categoria,
                    dataPagamento: d.data_pagamento
                        ? new Date(d.data_pagamento + "Z").toLocaleDateString("pt-BR", {
                            timeZone: "UTC",
                        })
                        : null,

                }));

                setContas(despesasConvertidas);
                console.log("Despesas carregadas:", despesasConvertidas);
            } catch (error) {
                console.error("Erro ao carregar despesas:", error);
            }
        };

        fetchDespesas();
    }, []);

    const atualizarStatusNoBanco = async (id, novoStatus, dataPagamento = null) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/despesas/atualizar/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status_divida: novoStatus,
                    data_pagamento: dataPagamento,
                }),
            });

            if (!response.ok) throw new Error("Erro ao atualizar status da despesa");
            const updated = await response.json();
            return updated;
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar status da despesa");
        }
    };

    const deletarDespesaNoBanco = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/despesas/deletar/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Erro ao deletar despesa");
            return true;
        } catch (error) {
            console.error(error);
            alert("Erro ao deletar despesa");
            return false;
        }
    };


    const camposObrigatoriosPreenchidos =
        descricao &&
        valorOriginal &&
        dataVencimento &&
        fornecedor &&
        categoria &&
        statusDivida &&
        (statusDivida !== "Pago" || dataPagamento);

    const salvarDespesaNoBanco = async (payload) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:5000/despesas/criar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (data.erros && Array.isArray(data.erros)) {
                    throw new Error(data.erros.join("\n"));
                } else if (data.message) {
                    throw new Error(data.message);
                } else {
                    throw new Error("Erro ao salvar despesa");
                }
            }

            return data;
        } catch (error) {
            console.error("Erro ao salvar despesa:", error);
            throw error;
        }
    };


    const handleAdicionarConta = async () => {
        if (!camposObrigatoriosPreenchidos) return;

        const categoriaNormalizada = categoria.trim();

        const payload = {
            descricao,
            valor_original: parseFloat(valorOriginal),
            data_vencimento: dataVencimento,
            status_divida: statusDivida,
            categoria: categoriaNormalizada,
            data_pagamento: statusDivida === "Pago" ? dataPagamento : null,
            fornecedorId: parseInt(fornecedor, 10),
        };

        try {
            const saved = await salvarDespesaNoBanco(payload);
            const savedId = saved.id_despesa || saved.id || null;

            const fornecedorObj = fornecedores.find(
                (f) => f.id_fornecedor === parseInt(fornecedor, 10)
            );
            const fornecedorNome = fornecedorObj
                ? fornecedorObj.nome_empresa
                : fornecedor;

            const novaConta = {
                id: savedId || contas.length + 1,
                descricao,
                fornecedor: parseInt(fornecedor, 10),
                fornecedorNome,
                vencimento: dataVencimento,
                valor: parseFloat(valorOriginal),
                status: statusDivida,
                categoria: categoriaNormalizada,
                dataPagamento: statusDivida === "Pago" ? dataPagamento : null,
            };

            setContas((prev) => [...prev, novaConta]);

            setDescricao("");
            setValorOriginal("");
            setDataVencimento("");
            setFornecedor("");
            setCategoria("");
            setStatusDivida("");
            setDataPagamento("");
        } catch (err) {
            console.error("Não foi possível salvar a despesa:", err);
        }
    };

    const handlePagar = async (id) => {
        const dataAtual = new Date().toISOString().split("T")[0];

        const updated = await atualizarStatusNoBanco(id, "Pago", dataAtual);
        if (updated) {
            setContas((prev) =>
                prev.map((conta) =>
                    conta.id === id
                        ? { ...conta, status: "Pago", dataPagamento: new Date(dataAtual).toLocaleDateString("pt-BR") }
                        : conta
                )
            );
        }
    };

    const handleDesfazer = async (id) => {
        const updated = await atualizarStatusNoBanco(id, "A_pagar", null);
        if (updated) {
            setContas((prev) =>
                prev.map((conta) =>
                    conta.id === id ? { ...conta, status: "A_pagar", dataPagamento: null } : conta
                )
            );
        }
    };

    const handleDeletar = async (id) => {
        if (window.confirm("Deseja realmente deletar esta despesa?")) {
            const deleted = await deletarDespesaNoBanco(id);
            if (deleted) {
                setContas((prev) => prev.filter((conta) => conta.id !== id));
            }
        }
    };


    const contasFiltradas = contas.filter((conta) => {
        if (filtroCategoria && conta.categoria !== filtroCategoria) return false;
        if (filtroStatus && conta.status !== filtroStatus) return false;

        if (filtroMesAno) {
            const [ano, mes] = filtroMesAno.split("-");
            const data = new Date(conta.vencimento);
            const anoVencimento = String(data.getFullYear());
            const mesVencimento = String(data.getMonth() + 1).padStart(2, "0");
            if (ano !== anoVencimento || mes !== mesVencimento) return false;
        }


        return true;
    });

    const contasAPagar = contasFiltradas.filter(
        (c) => c.status !== "Pago" && c.status !== "Cancelado/Estornado"
    ).length;
    const totalDespesas = contasFiltradas.length;

    const getStatusClass = (status) => {
        switch (status) {
            case "Vencida":
                return "status-vencida";
            case "A_pagar":
                return "status-a-pagar";
            case "Pago":
                return "status-pago";
            case "Cancelado_Estornado":
                return "status-cancelado";
            default:
                return "";
        }
    };
  return {
  descricao,
  setDescricao,
  valorOriginal,
  setValorOriginal,
  dataVencimento,
  setDataVencimento,
  fornecedor,
  setFornecedor,
  categoria,
  setCategoria,
  statusDivida,
  setStatusDivida,
  dataPagamento,
  setDataPagamento,
  filtroCategoria,
  setFiltroCategoria,
  filtroStatus,
  setFiltroStatus,
  filtroMesAno,
  setFiltroMesAno,
  fornecedores,
  contas,
  contasFiltradas,
  contasAPagar,
  totalDespesas,
  getStatusClass,
  handleAdicionarConta,
  handlePagar,
  handleDesfazer,
  handleDeletar,
  camposObrigatoriosPreenchidos
};


}
