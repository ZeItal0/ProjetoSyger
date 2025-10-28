import { useState, useEffect } from "react";

export function useRegistrarProduto() {
    const [formData, setFormData] = useState({ nomeProduto: "", categoria: "", unidadeCompra: "", quantidadeMinima: "", quantidadeMaxima: "", validade: "", unidadeMedida: "", valorTotal: ""});

    const [quantidade, setQuantidade] = useState(0);
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
    const [fornecedores, setFornecedores] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const fetchFornecedores = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:5000/cadastro/Listarfornecedores", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("erro ao buscar fornecedores");
                const data = await response.json();
                setFornecedores(data);
            } catch (err) {
                console.error("erro ao carregar fornecedores:", err);
                alert("erro ao carregar fornecedores.");
            } finally {
                setCarregando(false);
            }
        };
        fetchFornecedores();
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const aumentar = () => setQuantidade(quantidade + 1);
    const diminuir = () => setQuantidade(Math.max(0, quantidade - 1));

    const handleSalvarProduto = async () => {
        if (!fornecedorSelecionado) {
            alert("Por favor, selecione um fornecedor");
            return;
        }

        const id_usuario = Number(localStorage.getItem("id"));
        const token = localStorage.getItem("token");
        const dados = { ...formData, quantidade, fornecedorSelecionado, id_usuario };

        try {
            const response = await fetch("http://localhost:5000/cadastroProduto/insumo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(dados),
            });

            const resultado = await response.json();

            if (response.ok) {
                alert("Produto cadastrado com sucesso");
                console.log(resultado);
                setFormData({ nomeProduto: "", categoria: "", unidadeCompra: "", quantidadeMinima: "", quantidadeMaxima: "", validade: "", unidadeMedida: "", valorTotal: ""});
                setQuantidade(0);
                setFornecedorSelecionado(null);
            } else if (response.status === 400 && resultado.message) {
                alert(resultado.message.join("\n"));
            } else {
                alert("Erro: " + (resultado.erro || "Erro desconhecido"));
            }
        } catch (err) {
            console.error(err);
            alert("Erro ao cadastrar produto!");
        }
    };


    return { formData, setFormData, quantidade, aumentar, diminuir, fornecedorSelecionado, setFornecedorSelecionado, fornecedores, carregando, handleInputChange, handleSalvarProduto };
}
