import React from "react";
import "../assets/gestaoCardapio.css";
import edit from "../icons/edit.png";
import { useGestaoCardapio } from "../api/useGestaoCardapio";

const PratoItem = ({ prato, onEditVariacoes }) => {
    return (
        <div className="prato-item-card">
            <div className="prato-info-grid">
                <div className="prato-info-col">
                    <span className="prato-label">PRATO (RECEITA BASE)</span>
                    <span className="prato-nome">{prato.nome}</span>
                </div>
                <div className="prato-info-col">
                    <span className="prato-label">CUSTO BASE (R$)</span>
                    <span className="prato-custo"> R$ {prato.custoBase.toFixed(2)}</span>
                </div>
                <div className="prato-info-col opcoes-venda-col">
                    <span className="prato-label">OPÇÕES DE VENDA</span>
                    <div className="opcoes-venda-badges">
                        {(prato.variacoes || []).map((variacao) => (
                            <span key={variacao.id_variacao} className="variacao-badge">
                                {variacao.nome} (R${variacao.preco.toFixed(2)})
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="editar-variacoes-btn">
                <button className="editar-variacoes-btn__inner" onClick={() => onEditVariacoes(prato)}>
                    <img src={edit} alt="editar" />
                    <span>Editar Variações</span>
                </button>
            </div>
        </div>
    );
};

const EditarVariacoes = ({ prato, onSave, onCancel, onVariacaoChange, onAddVariacao, onRemoveVariacao, }) => {
    return (
        <div className="editar-variacoes-container">
            <h2>Editar Variações para: {prato.nome}</h2>

            <div className="opcoes-venda-section">
                <h3>Opções de Venda (Variações)</h3>
                <div className="variacoes-table">
                    <div className="variacoes-header">
                        <span>NOME NO MENU</span>
                        <span>MULTIPLICADOR DA RECEITA</span>
                        <span>PREÇO DE VENDA (R$)</span>
                        <span>AÇÃO</span>
                    </div>
                    {(prato.variacoes || []).map((variacao, index) => (
                        <div key={variacao.id_variacao} className="variacao-row">
                            <input type="text" value={variacao.nome} onChange={(e) => onVariacaoChange(index, "nome", e.target.value)} placeholder="Pequeno, Medio, Grande (0g)" />
                            <input type="number" step="0.1" value={variacao.multiplicador} onChange={(e) => onVariacaoChange(index, "multiplicador", parseFloat(e.target.value) || 0.0)} />
                            <input type="number" step="0.01" value={variacao.preco} onChange={(e) => onVariacaoChange(index, "preco", parseFloat(e.target.value) || 0.0)} />
                            <button className="remover-variacao-btn" onClick={() => onRemoveVariacao(index)}>Remover</button>
                        </div>
                    ))}
                </div>
                <button className="adicionar-variacao-btn" onClick={onAddVariacao}>+ Adicionar Variação de Porção</button>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button className="salvar-configuracoes-btn" onClick={onSave}>Salvar Configurações de Venda</button>
                <button className="adicionar-variacao-btn" onClick={onCancel} style={{ alignSelf: "center" }}>Cancelar</button>
            </div>
        </div>
    );
};

export default function GestaoCardapio() {
  const {
    pratos,
    carregando,
    pratoEmEdicao,
    handleEditVariacoes,
    handleSave,
    handleVariacaoChange,
    handleAddVariacao,
    handleRemoveVariacao,
    setPratoEmEdicao,
  } = useGestaoCardapio();

  if (carregando) return <h2 style={{ textAlign: "center" }}>Carregando pratos...</h2>;

  return (
        <div className="gestao-cardapio-vendas-container">
            <h1>Gestão do cardápio (Opções de Venda)</h1>

            <div className="pratos-list">
                {pratos.length > 0 ? (
                    pratos.map((prato) => (
                        <div key={prato.id} className="prato-com-editor">
                            <PratoItem prato={prato} onEditVariacoes={handleEditVariacoes} />
                            {pratoEmEdicao && pratoEmEdicao.id === prato.id && (
                                <EditarVariacoes
                                    prato={pratoEmEdicao}
                                    onSave={handleSave}
                                    onCancel={() => setPratoEmEdicao(null)}
                                    onVariacaoChange={handleVariacaoChange}
                                    onAddVariacao={handleAddVariacao}
                                    onRemoveVariacao={handleRemoveVariacao}
                                />
                            )}
                        </div>
                    ))
                ) : (
                    <p>nenhum prato encontrado</p>
                )}
            </div>
        </div>
    );
}
