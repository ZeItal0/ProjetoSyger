import React, { useState, useEffect } from "react";
import "../assets/registrarProduto.css";
import { useRegistrarProduto } from "../api/registrarProduto"
import FornecedorPng from "../icons/fornecedor.png";
import Plus from "../icons/plus.png";
import Minus from "../icons/minus.png";

export default function RegistrarProduto() {
  const { formData, quantidade, aumentar, diminuir, fornecedorSelecionado, setFornecedorSelecionado, fornecedores, carregando, handleInputChange, handleSalvarProduto } = useRegistrarProduto();

  return (
    <div className="registrar-produto-container">
      <div className="produto-form-section">
        <h2 className="titulo">Registrar Insumo</h2>

        <div className="input-row">
          <input type="text" name="nomeProduto" placeholder="Nome Do Produto" value={formData.nomeProduto} onChange={handleInputChange} className="input-full" />

          <select name="categoria" value={formData.categoria} onChange={handleInputChange}>
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

          <select name="unidadeCompra" value={formData.unidadeCompra} onChange={handleInputChange}>
            <option value="">Unidade de Compra</option>
            <option value="fardo">Fardo</option>
            <option value="unidade">Unidade</option>
            <option value="caixa">Caixa</option>
          </select>
        </div>

        <div className="input-row">
          <input type="number" name="quantidadeMinima" placeholder="Quantidade MÍN" value={formData.quantidadeMinima} onChange={handleInputChange} className="input-medium"/>
          <input type="number" name="quantidadeMaxima" placeholder="Quantidade MAX" value={formData.quantidadeMaxima} onChange={handleInputChange} className="input-medium"/>

          <input type="date" name="validade" value={formData.validade} onChange={handleInputChange} className="input-medium" />

          <select name="unidadeMedida" value={formData.unidadeMedida} onChange={handleInputChange}>
            <option value="">Unidade de medida</option>
            <option value="gramas">Gramas</option>
            <option value="litros">Litros</option>
            <option value="unidade">Unidade</option>
            <option value="kg">Kg</option>
          </select>

          <input type="number" name="valorTotal" placeholder="Valor Total" value={formData.valorTotal} onChange={handleInputChange} className="input-medium" />
        </div>

        <div className="quantidade-container">
          <span className="quantidade-label">Quantidade</span>
          <div className="quantidade-controls">
            <button className="btn-quantidade" onClick={diminuir}>
              <img src={Minus} alt="minus-icon" />
            </button>
            <span className="quantidade-valor">{quantidade}</span>
            <button className="btn-quantidade" onClick={aumentar}>
              <img src={Plus} alt="plus-icon" />
            </button>
          </div>
        </div>

        <button className={`btn-selecionar-fornecedor ${fornecedorSelecionado ? "selecionado" : ""}`} onClick={handleSalvarProduto}>Salvar Produto</button>
      </div>

      <div className="fornecedores-section">
        <h3 className="fornecedores-titulo">Fornecedores</h3>
        {carregando ? (
          <p>Carregando fornecedores...</p>
        ) : fornecedores.length === 0 ? (
          <p className="mensagem-vazia">nenhum fornecedor encontrado.</p>
        ) : (
          <div className="fornecedores-grid">
            {fornecedores.map((fornecedor) => (
              <div key={fornecedor.id_fornecedor} className={`fornecedor-card ${fornecedorSelecionado === fornecedor.id_fornecedor ? "selecionado" : ""}`} onClick={() => setFornecedorSelecionado(fornecedor.id_fornecedor)}>
                <div className="fornecedor-header">
                  <span className={`diamond ${fornecedorSelecionado === fornecedor.id_fornecedor ? "active" : ""}`}></span>
                  <span className="fornecedor-id">#{fornecedor.id_fornecedor}</span>
                </div>

                <div className="fornecedor-info">
                  <p className="fornecedor-nome">{fornecedor.nome_empresa}</p>
                  <p className="fornecedor-data">{fornecedor.data_cadastro ? new Date(fornecedor.data_cadastro).toLocaleDateString() : "Sem data"} </p>
                </div>

                <div className="fornecedor-icon">
                  <img src={FornecedorPng} alt="icon-fornecedor" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
