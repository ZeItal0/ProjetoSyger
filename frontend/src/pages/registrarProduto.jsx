import React, { useState } from "react";
import "../assets/registrarProduto.css";
import FornecedorPng from "../icons/fornecedor.png";
import Plus from "../icons/plus.png"
import Minus from "../icons/minus.png"

export default function RegistrarProduto() {
  const [formData, setFormData] = useState({
    nomeProduto: "",
    categoria: "",
    unidadeCompra: "",
    quantidadeMinima: "",
    validade: "",
    unidadeMedida: "",
    valorTotal: "",
  });

  const [quantidade, setQuantidade] = useState(0);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);

  const [fornecedores] = useState([
    { id: 1, nome: "Nome da empresa", data: "data: dd/mm/yyyy" },
    { id: 2, nome: "Nome da empresa", data: "data: dd/mm/yyyy" },
    { id: 3, nome: "Nome da empresa", data: "data: dd/mm/yyyy" },
    { id: 4, nome: "Nome da empresa", data: "data: dd/mm/yyyy" },
    { id: 5, nome: "Nome da empresa", data: "data: dd/mm/yyyy" },
    { id: 6, nome: "Nome da empresa", data: "data: dd/mm/yyyy" },
    { id: 7, nome: "Nome da empresa", data: "data: dd/mm/yyyy" },
    { id: 8, nome: "Nome da empresa", data: "data: dd/mm/yyyy" },
    { id: 9, nome: "Nome da empresa", data: "data: dd/mm/yyyy" },
    { id: 10, nome: "Nome da empresa", data: "data: dd/mm/yyyy" },
    { id: 11, nome: "Nome da empresa", data: "data: dd/mm/yyyy" },
    { id: 12, nome: "Nome da empresa", data: "data: dd/mm/yyyy" },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const aumentar = () => setQuantidade(quantidade + 1);
  const diminuir = () => setQuantidade(Math.max(0, quantidade - 1));

  const handleSalvarProduto = () => {
    if (!fornecedorSelecionado) {
      alert("Por favor, selecione um fornecedor!");
      return;
    }
    console.log("Produto salvo:", { ...formData, quantidade, fornecedorSelecionado });
    alert("Produto salvo com sucesso!");
  };

  return (
    <div className="registrar-produto-container">
     
      <div className="produto-form-section">
        <h2 className="titulo">Registrar Insumo</h2>

        
        <div className="input-row">
          <input type="text" name="nomeProduto" placeholder="Nome Do Produto" value={formData.nomeProduto} onChange={handleInputChange} className="input-full"/>
          <select name="categoria" value={formData.categoria} onChange={handleInputChange}>
            <option value="">Categoria</option>
            <option value="grãos">Grãos</option>
            <option value="óleos">Óleos</option>
            <option value="temperos">Temperos</option>
            <option value="bebidas">Bebidas</option>
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
          <input type="date" name="validade" value={formData.validade} onChange={handleInputChange} className="input-medium"/>
          <select name="unidadeMedida" value={formData.unidadeMedida} onChange={handleInputChange}>
            <option value="">Unidade de medida</option>
            <option value="gramas">Gramas</option>
            <option value="litros">Litros</option>
            <option value="unidade">Unidade</option>
            <option value="kg">Kg</option>
          </select>

          <input type="number" name="valorTotal" placeholder="Valor Total" value={formData.valorTotal} onChange={handleInputChange} className="input-medium"/>
        </div>

        <div className="quantidade-container">
          <span className="quantidade-label">quantidade</span>
          <div className="quantidade-controls">

            <button className="btn-quantidade" onClick={diminuir}>
              <img src={Plus} alt="plus-icon" />
            </button>

            <span className="quantidade-valor">{quantidade}</span>

            <button className="btn-quantidade" onClick={aumentar}>
              <img src={Minus} alt="minus-icon" />
            </button>

          </div>
        </div>


        <button className={`btn-selecionar-fornecedor ${fornecedorSelecionado ? 'selecionado' : ''}`} onClick={fornecedorSelecionado ? handleSalvarProduto : null} disabled={!fornecedorSelecionado}>
          {fornecedorSelecionado ? 'Salvar Produto' : 'Selecione um Fornecedor'}
        </button>
      </div>


      <div className="fornecedores-section">
        <h3 className="fornecedores-titulo">Fornecedores</h3>
        <div className="fornecedores-grid">
          {fornecedores.map((fornecedor) => (

            <div key={fornecedor.id} className={`fornecedor-card ${fornecedorSelecionado === fornecedor.id ? "selecionado" : ""}`}onClick={() => setFornecedorSelecionado(fornecedor.id)}>
              <div className="fornecedor-header">
                <span className={`diamond ${fornecedorSelecionado === fornecedor.id ? "active" : ""}`} ></span>
                <span className="fornecedor-id">#{fornecedor.id}</span>
              </div>

              <div className="fornecedor-info">
                <p className="fornecedor-nome">{fornecedor.nome}</p>
                <p className="fornecedor-data">{fornecedor.data}</p>
              </div>

              <div className="fornecedor-icon">
                <img src={FornecedorPng} alt="icon-fornecedor" />
              </div>
            </div>
            
          ))}
        </div>
      </div>
    </div>
  );
}

