import React, { useState } from "react";
import "../assets/inventario.css";
import Check from "../icons/check.png";
import Delete from "../icons/delete.png";
import plus from "../icons/plus.png";
import minus from "../icons/minus.png";

const ModalEdicao = ({ item, onClose, onAtualizar, onExcluir }) => {
    const [formData, setFormData] = useState({
        nomeProduto: item.nome,
        quantidadeMinima: item.quantidade_minima || 0,
        quantidadeMaxima: item.quantidade_maxima || 0,
        categoria: item.categoria || "",
        unidadeCompra: item.forma_compra || "",
        validade: item.validade ? new Date(item.validade).toISOString().split("T")[0] : "",
        unidadeMedida: item.unidadeMedida || "",
        quantidadeAtual: item.quantidade || 0,
        tipoAlteracao: "Entrada",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const alterarEstoque = (tipo) => {
        let qtd = formData.quantidadeAtual;
        if (tipo === "add") qtd += 1;
        else qtd = Math.max(0, qtd - 1);
        setFormData({ ...formData, quantidadeAtual: qtd });
    };

    const handleSalvar = () => {
        onAtualizar(item.id, formData);
        onClose();
    };

    const handleExcluir = () => {
        onExcluir(item.id);
        onClose();
    };

    if (!item) return null;

    return (
        <div className="modal-edicao">
            <h3 className="modal-titulo">Editar Insumo</h3>

            <div className="modal-inputs-row">
                <input type="text" name="nomeProduto" value={formData.nomeProduto} onChange={handleChange} className="modal-input" />
                <input type="number" name="quantidadeMinima" value={formData.quantidadeMinima} onChange={handleChange} className="modal-input" />
                <input type="number" name="quantidadeMaxima" value={formData.quantidadeMaxima} onChange={handleChange} className="modal-input" />
                <select name="categoria" value={formData.categoria} onChange={handleChange} className="modal-input modal-select">
                    <option value="">Categoria</option>
                    <option value="Carnes">Carnes</option>
                    <option value="Laticínios">Laticínios</option>
                    <option value="Grãos">Grãos</option>
                    <option value="Massas">Massas</option>
                    <option value="Gorduras">Gorduras</option>
                    <option value="Temperos">Temperos</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Congelados">Congelados</option>
                </select>
            </div>

            <div className="modal-inputs-row">
                <select name="tipoAlteracao" value={formData.tipoAlteracao} onChange={handleChange} className="modal-input modal-select">
                    <option value="">Tipo de Alteracao</option>
                    <option value="Entrada">Entrada</option>
                    <option value="Saida">Saída</option>
                    <option value="Reestoque">Reestoque</option>
                    <option value="Ajuste">Ajuste</option>
                </select>
                <input type="date" name="validade" value={formData.validade} onChange={handleChange} className="modal-input" />
                <select name="unidadeMedida" value={formData.unidadeMedida} onChange={handleChange} className="modal-input modal-select">
                    <option value="">Unidade de medida</option>
                    <option value="gramas">Gramas</option>
                    <option value="mililitros">Mililitros</option>
                </select>
                <select name="unidadeCompra" value={formData.unidadeCompra} onChange={handleChange} className="modal-input modal-select">
                    <option value="">Unidade de Compra</option>
                    <option value="fardo">Fardo</option>
                    <option value="unidade">Unidade</option>
                    <option value="caixa">Caixa</option>
                </select>
            </div>

            <div className="modal-estoque">
                <p>Quantidade no Estoque</p>
                <div className="modal-estoque-controls">
                    <button onClick={() => alterarEstoque("remove")} className="modal-estoque-remove"><img src={minus} alt="minus" /></button>
                    <span>{formData.quantidadeAtual}</span>
                    <button onClick={() => alterarEstoque("add")} className="modal-estoque-add"><img src={plus} alt="plus" /></button>
                </div>
            </div>

            <div className="modal-actions">
                <button className="modal-btn modal-btn-salvar" onClick={handleSalvar}><img src={Check} alt="Salvar" /> Salvar Alteração</button>
                <button className="modal-btn modal-btn-excluir" onClick={handleExcluir}><img src={Delete} alt="Excluir" /> Excluir produto</button>
            </div>
        </div>
    );
};

export default ModalEdicao;