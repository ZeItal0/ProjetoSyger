import React, { useState } from "react";
import "../assets/gestaocardapio.css";
import GlassBox from "../components/GlassBox";

export default function GestaoCardapio() {
    const [pratos, setPratos] = useState([
        {
            nome: "Nome do Prato",
            custoBase: 0,
            variacoes: [
                { nome: "Pequeno (0g)", multiplicador: 0, preco: 0 },
                { nome: "Médio (0g)", multiplicador: 0, preco: 0 },
                { nome: "Grande (0g)", multiplicador: 0, preco: 0 },
            ],
        },
        {
            nome: "Outro Prato",
            custoBase: 0,
            variacoes: [
                { nome: "Pequeno (0g)", multiplicador: 0, preco: 0 },
                { nome: "Médio (0g)", multiplicador: 0, preco: 0 },
                { nome: "Grande (0g)", multiplicador: 0, preco: 0 },
            ],
        },
        {
            nome: "Outro Prato",
            custoBase: 0,
            variacoes: [
                { nome: "Pequeno (0g)", multiplicador: 0, preco: 0 },
                { nome: "Médio (0g)", multiplicador: 0, preco: 0 },
                { nome: "Grande (0g)", multiplicador: 0, preco: 0 },
            ],
        },
        {
            nome: "Outro Prato",
            custoBase: 0,
            variacoes: [
                { nome: "Pequeno (0g)", multiplicador: 0, preco: 0 },
                { nome: "Médio (0g)", multiplicador: 0, preco: 0 },
                { nome: "Grande (0g)", multiplicador: 0, preco: 0 },
            ],
        },
    ]);

    const [pratoSelecionado, setPratoSelecionado] = useState(null);
    const [novoAdicional, setNovoAdicional] = useState("");


    const editarPrato = (index) => setPratoSelecionado(index);

    const adicionarVariacao = () => {
        if (pratoSelecionado === null) return;
        setPratos((antigos) => {
            const novos = [...antigos];
            const variacoes = [...novos[pratoSelecionado].variacoes];
            variacoes.push({ nome: "", multiplicador: 0, preco: 0 });
            novos[pratoSelecionado] = { ...novos[pratoSelecionado], variacoes };
            return novos;
        });
    };

    const removerVariacao = (varIndex) => {
        if (pratoSelecionado === null) return;
        setPratos((antigos) => {
            const novos = [...antigos];
            const variacoes = [...novos[pratoSelecionado].variacoes];
            variacoes.splice(varIndex, 1);
            novos[pratoSelecionado] = { ...novos[pratoSelecionado], variacoes };
            return novos;
        });
    };


    const atualizarVariacao = (varIndex, campo, valor) => {
        if (pratoSelecionado === null) return;

        setPratos((antigos) => {
            const novos = [...antigos];
            const variacoes = [...novos[pratoSelecionado].variacoes];
            const variacao = { ...variacoes[varIndex] };

            if (campo === "multiplicador" || campo === "preco") {
                variacao[campo] = valor === "" ? "" : Number(valor);
            } else {
                variacao[campo] = valor;
            }

            variacoes[varIndex] = variacao;
            novos[pratoSelecionado] = { ...novos[pratoSelecionado], variacoes };
            return novos;
        });
    };


    return (
        <div className="gestao-cardapio-container">
            <GlassBox>
                <h2>Gestão do cardápio</h2>
                    <div className="tabela-scroll">
                    <table className="tabela-pratos">
                        <thead>
                            <tr>
                                <th>PRATO (RECEITA BASE)</th>
                                <th>CUSTO BASE (R$)</th>
                                <th>OPÇÕES DE VENDA</th>
                                <th>AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>

                            {pratos.map((prato, index) => (
                                <tr key={index}>
                                    <td>{prato.nome}</td>
                                    <td>R$ {prato.custoBase.toFixed(2)}</td>
                                    <td> {prato.variacoes.map((v, i) => (<span key={i} className="badge"> {v.nome} (R$ {Number(v.preco).toFixed(2)}) </span>))} </td>
                                    <td> <button className="editar-btn" onClick={() => editarPrato(index)}> Editar Variações </button> </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </GlassBox>

            <p></p>

            {pratoSelecionado !== null && (
                <GlassBox>
                    <div className="editar-area">
                        <h3>Editar Variações para: <span>{pratos[pratoSelecionado].nome}</span></h3>

                        <div className="tabela-variacoes">
                            <div className="header">
                                <span>NOME NO MENU</span>
                                <span>MULTIPLICADOR DA RECEITA</span>
                                <span>PREÇO DE VENDA (R$)</span>
                                <span>AÇÃO</span>
                            </div>

                            {pratos[pratoSelecionado].variacoes.map((v, i) => (
                                <div key={i} className="linha-variacao">

                                    <input value={v.nome} onChange={(e) => atualizarVariacao(i, "nome", e.target.value)} />

                                    <input type="number" step="0.1" value={v.multiplicador} onChange={(e) => atualizarVariacao(i, "multiplicador", e.target.value)} />

                                    <input type="number" step="0.1" value={v.preco} onChange={(e) => atualizarVariacao(i, "preco", e.target.value)} />

                                    <button className="remover-btn" onClick={() => removerVariacao(i)}> Remover </button>

                                </div>
                            ))}

                            <button className="add-variacao-btn" onClick={adicionarVariacao}> + Adicionar Variação de Porção</button>

                        </div>

                        <div className="modificadores">
                            <label>Modificadores / Adicionais</label>
                            <div className="linha-modificador">
                                <input type="text" placeholder="Ex: Adicional de Queijo" value={novoAdicional} onChange={(e) => setNovoAdicional(e.target.value)} />
                                <button className="add-modificacao-btn">Adicionar</button>
                            </div>
                        </div>

                        <button className="salvar-btn">Salvar Configurações de Venda</button>
                    </div>
                </GlassBox>
            )}
        </div>
    );
}