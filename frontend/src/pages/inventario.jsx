import React, { useState } from "react";
import "../assets/inventario.css";
import Check from "../icons/check.png";
import Delete from "../icons/delete.png";
import Edit from "../icons/edit.png";
import plus from "../icons/plus.png";
import minus from "../icons/minus.png"

const inventarioItens = [
  {
    id: 1,
    nome: "Nome do produto 1",
    quantidade: 0,
    valorTotal: "R$ 00.00",
    fornecedor: "Nome do Fornecedor A",
    validade: "Data A",
    dataRegistro: "Data A",
    categoria: "Carnes",
  },
  {
    id: 2,
    nome: "Nome do produto 2",
    quantidade: 15,
    valorTotal: "R$ 45.99",
    fornecedor: "Nome do Fornecedor B",
    validade: "Data B",
    dataRegistro: "Data B",
    categoria: "Laticínios",
  },
 
];

const ModalEdicao = ({ item }) => {
    return (
        <div className="modal-edicao">
            <h3 className="modal-titulo">Editar Insumo</h3>
            
            <div className="modal-inputs-row">
                <input type="text" placeholder="Nome Do Produto" className="modal-input" />
                <input type="text" placeholder="Quantidade MIN" className="modal-input" />
                <select className="modal-input modal-select">
                    <option value="">Categoria</option>
                </select>
                <select className="modal-input modal-select">
                    <option value="">Unidade de Compra</option>
                </select>
            </div>

            <div className="modal-inputs-row">
                <select className="modal-input modal-select">
                    <option value="">Alteração</option>
                </select>
                <input type="text" placeholder="Quantidade MIN" className="modal-input" />
                <input type="date" placeholder="Validade" className="modal-input" />
                <select className="modal-input modal-select">
                    <option value="">Unidade de medida</option>
                </select>
            </div>

            <div className="modal-estoque">
                <p>Quantidade no Estoque</p>
                <div className="modal-estoque-controls">
                    <button className="modal-estoque-add"><img src={plus} alt="plus-icon"/></button>
                    <span>0</span>
                    <button className="modal-estoque-remove"><img src={minus} alt="minus-icon"/></button>
                </div>
            </div>

            <div className="modal-actions">
                <button className="modal-btn modal-btn-salvar">
                    <img src={Check} alt="Salvar" />
                    Salvar Alteração
                </button>
                <button className="modal-btn modal-btn-excluir">
                    <img src={Delete} alt="Excluir" />
                    Excluir produto
                </button>
            </div>
        </div>
    );
};


export default function Inventario() {
  const categorias = [
    "Todos",
    "Carnes",
    "Laticínios",
    "Grãos",
    "Massas",
    "Gorduras",
    "Temperos",
    "Bebidas",
    "Congelados",
  ];

  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [itemEmEdicao, setItemEmEdicao] = useState(null);

  const toggleModal = (itemId) => {
    setItemEmEdicao(itemEmEdicao === itemId ? null : itemId);
  };

  const itensFiltrados = inventarioItens.filter(item => 
    categoriaAtiva === "Todos" || item.categoria === categoriaAtiva
  );

  const renderItemCard = (item) => {
    const infoData = [
      { header: "Produto", value: item.nome },
      { header: "Quantidade UN", value: item.quantidade },
      { header: "Valor Total", value: item.valorTotal },
      { header: "Fornecedor", value: item.fornecedor },
      { header: "validade", value: item.validade },
      { header: "Data de registro", value: item.dataRegistro },
    ];

    const isEditing = itemEmEdicao === item.id;

    return (
      <div className="item-wrapper">
        <div className="item-card">
          <div className="item-info">
            {infoData.map((data, index) => (
              <div key={index}>
                <div className="item-header">{data.header}</div>
                <div className="item-value">{data.value}</div>
              </div>
            ))}
          </div>
          <div className="item-actions">
            <button className="item-actions-btn" onClick={() => toggleModal(item.id)}>
              <img src={Edit} alt="Editar-icon" />
              Editar
            </button>
          </div>
        </div>
        {isEditing && <ModalEdicao item={item} />}
      </div>
    );
  };

  return (
    <div className="inventario-container">
      <h2 className="titulo-inventario">Insumos</h2>

      <div className="categorias">
        {categorias.map((cat, index) => (
          <button key={index} className={`categoria-btn ${ categoriaAtiva === cat ? "active" : "" }`} onClick={() => setCategoriaAtiva(cat)}> 
            {cat} 
          </button>
        ))}
      </div>

      <div className="lista-itens">
        {itensFiltrados.map(item => (
          <div key={item.id}>{renderItemCard(item)}</div>
        ))}
        {itensFiltrados.length > 0 && (
            <div key="extra">{renderItemCard({...itensFiltrados[0], id: 999})}</div> 
        )}
      </div>
    </div>
  );
}
