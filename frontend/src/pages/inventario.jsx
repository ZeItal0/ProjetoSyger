import React, { useState } from "react";
import "../assets/inventario.css";
import Edit from "../icons/edit.png";
import ModalEdicao from "./modalEdicao";
import { useInsumos } from "../api/inventario";

export default function Inventario() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [itemEmEdicao, setItemEmEdicao] = useState(null);

  const { itens, loading, erro, atualizarInsumo, excluirInsumo } = useInsumos();

  const categorias = [ "Todos", "Carnes", "Laticínios", "Grãos", "Massas", "Gorduras", "Temperos", "Bebidas", "Congelados",];

  const itensFiltrados =
    categoriaAtiva === "Todos"
      ? itens
      : itens.filter((item) => item.categoria === categoriaAtiva);

  const handleAtualizar = async (id, dadosAtualizados) => {
    try {
      await atualizarInsumo(id, dadosAtualizados);
      alert("Insumo atualizado!");
      setItemEmEdicao(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este insumo?")) return;
    try {
      await excluirInsumo(id);
      alert("Insumo Excluido!");
      setItemEmEdicao(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const renderItemCard = (item) => {
    const isEditing = itemEmEdicao === item.id;
    return (
      <div className="item-wrapper" key={item.id}>
        <div className="item-card">
          <div className="item-info">
            <div>
              <div className="item-header">Produto</div>
              <div className="item-value">{item.nome}</div>
            </div>
            <div>
              <div className="item-header">Quantidade</div>
              <div className="item-value">{item.quantidade}</div>
            </div>
            <div>
              <div className="item-header">Valor Unitário</div>
              <div className="item-value">{item.valorTotal}</div>
            </div>
            <div>
              <div className="item-header">Fornecedor</div>
              <div className="item-value">{item.fornecedor}</div>
            </div>
            <div>
              <div className="item-header">Validade</div>
              <div className="item-value">{item.validade}</div>
            </div>
            <div>
              <div className="item-header">Data de Registro</div>
              <div className="item-value">{item.dataRegistro}</div>
            </div>
          </div>
          <div className="item-actions">
            <button className="item-actions-btn" onClick={() => setItemEmEdicao(item.id)}><img src={Edit} alt="Editar" /> Editar </button>
          </div>
        </div>

        {isEditing && (
          <ModalEdicao item={item} onClose={() => setItemEmEdicao(null)} onAtualizar={handleAtualizar} onExcluir={handleExcluir}/>
        )}
      </div>
    );
  };

  if (loading) return <p>carregando insumos</p>;
  if (erro) return <p>erro ao carregar insumos: {erro}</p>;

  return (
    <div className="inventario-container">
      <h2 className="titulo-inventario">Insumos</h2>

      <div className="categorias">
        {categorias.map((cat, index) => (
          <button key={index} className={`categoria-btn ${categoriaAtiva === cat ? "active" : ""}`} onClick={() => setCategoriaAtiva(cat)}>{cat}</button>
        ))}
      </div>

      <div className="lista-itens">
        {itensFiltrados.length > 0 ? (
          itensFiltrados.map(renderItemCard)
        ) : (
          <p className="nenhum-item">insumos não encontrados</p>
        )}
      </div>
    </div>
  );
}
