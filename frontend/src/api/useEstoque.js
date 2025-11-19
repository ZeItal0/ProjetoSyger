import { useState, useEffect } from "react";

export function useEstoque() {
    const [filtroFornecedor, setFiltroFornecedor] = useState("");
    const [filtroNivelEstoque, setFiltroNivelEstoque] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [filtroStatusValidade, setFiltroStatusValidade] = useState("");
    const [filtroPesquisa, setFiltroPesquisa] = useState("");
    const [fornecedores, setFornecedores] = useState([]);
    const [itensEstoque, setItensEstoque] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [totalResultados, setTotalResultados] = useState(0);

    const getStatusEstoque = (quantidade, minimo) => {
        if (quantidade < minimo) return "abaixo";
        else if (quantidade >= minimo && quantidade < minimo * 1.5) return "ok";
        else return "excesso";
    };

    const getStatusValidade = (dataValidade) => {
        const hoje = new Date();
        const validade = new Date(dataValidade);
        const dias = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));

        if (dias < 0) return "vencido";
        else if (dias <= 30) return "proximo";
        return "normal";
    };

    const formatarData = (dataString) => {
        if (!dataString) return "—";
        return new Date(dataString).toLocaleDateString("pt-BR");
    };

    const carregarFornecedores = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/cadastro/Listarfornecedores", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setFornecedores(await res.json());
        } catch (err) {
            console.error("Erro ao carregar fornecedores:", err);
        }
    };

    const buscarEstoque = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            const params = new URLSearchParams({
                fornecedor: filtroFornecedor,
                nivelEstoque: filtroNivelEstoque,
                categoria: filtroCategoria,
                statusValidade: filtroStatusValidade,
                pesquisa: filtroPesquisa,
                page: paginaAtual,
                limit: 20
            });

            const res = await fetch(
                `http://localhost:5000/relatoriosEstoque/estoque?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = await res.json();

            setItensEstoque(data.itens);
            setPaginaAtual(data.paginaAtual);
            setTotalPaginas(data.totalPaginas);
            setTotalResultados(data.totalResultados);
        } catch (err) {
            console.error("Erro ao carregar estoque:", err);
        } finally {
            setLoading(false);
        }
    };

    const exportarPDF = async (url, filename) => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(url, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) return alert("Erro ao gerar PDF");

            const blob = await res.blob();
            const urlBlob = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = urlBlob;
            a.download = filename;
            a.click();

            window.URL.revokeObjectURL(urlBlob);
        } catch (error) {
            console.error("Erro ao exportar PDF:", error);
        }
    };

    const exportarInventario = () =>
        exportarPDF("http://localhost:5000/relatoriosEstoque/inventario", "inventario_completo.pdf");

    const exportarReposicao = () =>
        exportarPDF("http://localhost:5000/relatoriosEstoque/reposicao", "relatorio_reposicao.pdf");

    useEffect(() => {
        carregarFornecedores();
    }, []);

    useEffect(() => {
        setPaginaAtual(1);
        buscarEstoque();
    }, [filtroFornecedor, filtroNivelEstoque, filtroCategoria, filtroStatusValidade, filtroPesquisa]);

    useEffect(() => {
        buscarEstoque();
    }, [paginaAtual]);


    return {
        fornecedores,
        itensEstoque,
        loading,
        paginaAtual,
        totalPaginas,
        totalResultados,
        filtroFornecedor,
        filtroNivelEstoque,
        filtroCategoria,
        filtroStatusValidade,
        filtroPesquisa,
        setFiltroFornecedor,
        setFiltroNivelEstoque,
        setFiltroCategoria,
        setFiltroStatusValidade,
        setFiltroPesquisa,
        setPaginaAtual,
        getStatusEstoque,
        getStatusValidade,
        formatarData,
        exportarInventario,
        exportarReposicao
    };
}
