import React from "react";
import GlassBox from "../components/GlassBox";
import "../assets/registrarFornecedor.css";

export default function RegistrarFornecedores() {
  return (
    <div className="registrar-fornecedor-container">
      <GlassBox>
      <h2 className="titulo">Registrar Fornecedor</h2>

      <form className="form-fornecedor">
        <div className="linha">
          <input type="text" placeholder="Nome da Empresa" />
        </div>

        <div className="linha">
          <input type="text" placeholder="CNPJ" />
          <input type="text" placeholder="Inscrição Estadual" />
        </div>

        <div className="linha">
          <input type="text" placeholder="Nome do Contato" />
          <input type="text" placeholder="Contato" />
        </div>

        <div className="linha">
          <input type="email" placeholder="E-mail" />
        </div>

        <div className="linha">
          <input type="text" placeholder="CEP" />
          <input type="text" placeholder="Rua" />
        </div>

        <div className="linha">
          <input type="text" placeholder="Número" />
          <input type="text" placeholder="Bairro" />
        </div>

        <div className="linha">
            <textarea placeholder="Observações"></textarea>
        </div>

        <button type="submit" className="btn-salvar-fornecedor">Salvar Fornecedor</button>
      </form>
      </GlassBox>
    </div>
  );
}
