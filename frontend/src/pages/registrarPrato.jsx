import React, { useState } from "react";
import "../assets/registrarprato.css";
import Plus from "../icons/plus.png";
import Plusadd from "../icons/plusadd.png";
import Minus from "../icons/minus.png";
import Minusremove from "../icons/minusremove.png";

export default function RegistrarPrato() {
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

  const [ingredientes, setIngredientes] = useState([]);

  const produtosExemplo = Array.from({ length: 63 }, (_, i) => ({
    id: i,
    nome: "Nome produto",
    medida: "",
    preco: "0,00$",
  }));

  const adicionarIngrediente = (produto) => {
    setIngredientes((prev) => {
      const idx = prev.findIndex((ing) => ing.id === produto.id);
      if (idx !== -1) {
        const novaLista = [...prev];

        novaLista[idx] = {
          ...novaLista[idx], quantidade: novaLista[idx].quantidade + 1,
        };
        return novaLista;

      }

      return [
        ...prev,
        {
          id: produto.id,
          nome: produto.nome,
          medida: produto.medida,
          quantidade: 1,
        },
      ];
    });
  };

  const removerIngrediente = (produto) => {
    setIngredientes((prev) => {
      const idx = prev.findIndex((ing) => ing.id === produto.id);
      if (idx === -1) return prev;

      const novaLista = [...prev];
      const atual = novaLista[idx];

      if (atual.quantidade <= 1) {
        novaLista.splice(idx, 1);
      } else {
        novaLista[idx] = {
          ...atual,
          quantidade: atual.quantidade - 1,
        };
      }
      return novaLista;
    });
  };



  return (
    <div className="registrar-prato-container">

      <div className="top-section">
        <div className="form-area">
          <h2>Registrar Prato</h2>
          <div className="inputs">
            <input type="text" placeholder="Nome do prato" />
            <input type="text" placeholder="Valor do prato" />
            <input type="text" placeholder="Tempo de preparo" />
            <select>
              <option>Categoria</option>
            </select>
          </div>
          <button className="btn-salvar-prato">Salvar Prato</button>
        </div>


        <div className="ingredientes-area">
          <h2>Ingredientes</h2>
          <div className="ingredientes-header">
            <span>Nome</span>
            <span>quantidade</span>
            <span>Medida</span>
          </div>

          <div className="ingredientes-lista">
            {ingredientes.map((ing) => (
              <div key={ing.id} className="ingrediente-item">
                <span className="nome">{ing.nome}</span>

                <div className="qtd-controles">

                  <button onClick={() => adicionarIngrediente({ id: ing.id, nome: ing.nome, medida: ing.medida, })}> <img src={Plus} alt="plus-icon" /> </button>
                  <span>{ing.quantidade}</span>
                  <button onClick={() => removerIngrediente({ id: ing.id, nome: ing.nome, medida: ing.medida, })}> <img src={Minus} alt="minus-icon" /> </button>

                </div>


                <span className="medida">
                  <input type="text" className="input-medida" value={ing.medida} onChange={(e) => {
                    const novaMedida = e.target.value;
                    setIngredientes((prev) => prev.map((i) => i.id === ing.id ? { ...i, medida: novaMedida } : i));
                  }} />
                  {ing.medida}(g)
                </span>


              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="estoque-area">
        <h2>Alimentos do Estoque</h2>
          <div className="categorias">
            {categorias.map((cat) => (
              <button key={cat} className={`categoria-btn ${categoriaAtiva === cat ? "active" : ""}`} onClick={() => setCategoriaAtiva(cat)} > {cat}</button>
            ))}
          </div>
          <div className="produtos-scroll">
            <div className="grid-produtos">
              {produtosExemplo.map((produto) => (
                <div key={produto.id} className="card-produto">
                  
                    <p className="nome-produto"> {produto.nome} {produto.unidade} </p>
                    <p className="quantidade-produto">Unidades {produto.unidade}</p>
                    <p className="preco-produto">Preço {produto.preco}</p>

                  <div className="acoes">
                    <button className="btn add" onClick={() => adicionarIngrediente(produto)}><img src={Plusadd} alt="plus-icon"/></button>
                    <button className="btn remove" onClick={() => removerIngrediente(produto)}><img src={Minusremove} alt="minus-icon"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>


    </div>
  );
}