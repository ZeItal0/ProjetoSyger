import { useState, useEffect } from "react";

export function useCardapioDoDia() {
    const [pratosGerais, setPratosGerais] = useState([]);
    const [cardapioDia, setCardapioDia] = useState([]);
    const [todasCategorias, setTodasCategorias] = useState(["Todos"]);
    const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
    const [termoBusca, setTermoBusca] = useState("");

    useEffect(() => {
        let ativo = true;
        const carregarPratos = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch("http://localhost:5000/cardapio/cardapio-dia", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await response.json();
                if (!ativo) return;
                const lista = Array.isArray(data) ? data : [];

                const pratosFormatados = lista.flatMap((prato) =>
                    (prato.variacoes ?? []).map((variacao) => ({
                        id: variacao.id_variacao,
                        nome: prato.nome,
                        porcao: variacao.nome,
                        categoria: prato.categoria,
                        preco: parseFloat(variacao.preco) || 0,
                    }))
                );

                setPratosGerais(pratosFormatados);

                const categorias = ["Todos", ...new Set(lista.map((p) => p.categoria))];
                setTodasCategorias(categorias);
            } catch (err) {
                console.error("Erro ao carregar pratos:", err);
            }
        };

        carregarPratos();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:5000/cardapio/cardapio-dia/ativo", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.pratos)) {
                    const listaFormatada = data.pratos.map((p) => ({
                        id: p.id_cardapio_prato,
                        nome: p.nome_prato,
                        porcao: p.variacao || "",
                        categoria: p.categoria || "sem categoria",
                        preco: p.preco || 0,
                        status: p.status || "DISPONIVEL",
                    }));

                    setCardapioDia(listaFormatada);
                } else {
                    console.warn("backend nao retornou array de pratos:", data);
                    setCardapioDia([]);
                }
            })
            .catch((err) => console.error("erro ao buscar cardapio do dia:", err));
    }, []);



    const pratosFiltrados = pratosGerais.filter((prato) => {
        const filtroCategoria = categoriaAtiva === "Todos" || prato.categoria === categoriaAtiva;
        const termo = termoBusca.toLowerCase();
        const filtroBusca =
            prato.nome.toLowerCase().includes(termo) || prato.categoria.toLowerCase().includes(termo);
        return filtroCategoria && filtroBusca;
    });

    const handleAdicionarPrato = (pratoId) => {
        const pratoParaAdicionar = pratosGerais.find((p) => p.id === pratoId);
        if (pratoParaAdicionar) {
            setPratosGerais(pratosGerais.filter((p) => p.id !== pratoId));
            setCardapioDia([...cardapioDia, { ...pratoParaAdicionar, status: "DISPONIVEL" }]);
        }
    };

    const handleRemoverPrato = async (pratoId) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/cardapio/cardapio-dia/remover/${pratoId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.mensagem || "Erro ao remover o prato do cardápio");
                return;
            }

            setCardapioDia((prev) => prev.filter((p) => p.id !== pratoId));
            alert(data.mensagem || "Prato removido com sucesso!");
        } catch (err) {
            console.error("Erro ao remover prato:", err);
            alert("Erro ao tentar remover prato!");
        }
    };


    const handleStatusChange = async (id, novoStatus) => {
        try {
            const token = localStorage.getItem("token");

            setCardapioDia((prev) =>
                prev.map((p) => (p.id === id ? { ...p, status: novoStatus } : p))
            );

            const res = await fetch(`http://localhost:5000/cardapio/cardapio-dia/status/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: novoStatus }),
            });

            if (!res.ok) throw new Error("Erro ao atualizar status no servidor");
            console.log("ID:", id, "Novo status:", novoStatus);
            const data = await res.json();
            console.log("✅ Atualizado no banco:", data.mensagem);
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            alert("Erro ao atualizar status no banco.");
        }
    };


    const handleSalvarCardapio = async () => {
        try {
            const token = localStorage.getItem("token");

            const payload = cardapioDia.map((item) => ({
                variacaoId: item.id,
                status: item.status,
            }));

            const res = await fetch("http://localhost:5000/cardapio/cardapio-dia/adicionar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ pratos: payload }),
            });

            const data = await res.json();
            alert(data.message || "Cardápio salvo com sucesso!");
        } catch (err) {
            console.error("erro ao salvar cardapio:", err);
            alert("erro ao salvar cardápio do dia");
        }
    };

    return {
        pratosGerais,
        cardapioDia,
        todasCategorias,
        categoriaAtiva,
        termoBusca,
        pratosFiltrados,
        setCategoriaAtiva,
        setTermoBusca,
        handleAdicionarPrato,
        handleRemoverPrato,
        handleStatusChange,
        handleSalvarCardapio,
    };
}