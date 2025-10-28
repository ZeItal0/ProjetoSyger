import React, { useState } from "react";
import GlassBox from "../components/GlassBox";
import "../assets/registrarFornecedor.css";
import { useFornecedor } from "../api/fornecedor";

export default function RegistrarFornecedores() {
  const { formData, handleChange, handleSubmit } = useFornecedor();

  return (
    <div className="registrar-fornecedor-container">
      <GlassBox>
        <h2 className="titulo">Registrar Fornecedor</h2>

        <form className="form-fornecedor" onSubmit={handleSubmit}>
          <div className="linha">
            <input type="text" name="nome_empresa" placeholder="Nome da Empresa" value={formData.nome_empresa} onChange={handleChange}/>
          </div>

          <div className="linha">
            <input type="text" name="cnpj" placeholder="CNPJ" value={formData.cnpj} onChange={handleChange}/>
            <input type="text" name="inscricao_estadual" placeholder="Inscrição Estadual" value={formData.inscricao_estadual}onChange={handleChange}/>
          </div>

          <div className="linha">
            <input type="text" name="nome_contato" placeholder="Nome do Contato" value={formData.nome_contato} onChange={handleChange}/>
            <input type="text" name="telefone" placeholder="Contato" value={formData.telefone} onChange={handleChange}/>
          </div>

          <div className="linha">
            <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange}/>
          </div>

          <div className="linha">
            <input type="text" name="cep" placeholder="CEP" value={formData.cep} onChange={handleChange}/>
            <input type="text" name="rua" placeholder="Rua" value={formData.rua} onChange={handleChange}/>
          </div>

          <div className="linha">
            <input type="text" name="numero" placeholder="Número" value={formData.numero} onChange={handleChange}/>
            <input type="text" name="bairro" placeholder="Bairro" value={formData.bairro} onChange={handleChange}/>
          </div>

          <div className="linha">
            <textarea name="observacoes" placeholder="Observações" value={formData.observacoes} onChange={handleChange}></textarea>
          </div>

          <button type="submit" className="btn-salvar-fornecedor">Salvar Fornecedor</button>
        </form>
      </GlassBox>

    </div>
  );
}
