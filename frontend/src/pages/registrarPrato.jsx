import React from "react";
import "../assets/registrarprato.css";
import Plus from "../icons/plus.png";
import Plusadd from "../icons/plusadd.png";
import Minus from "../icons/minus.png";
import Minusremove from "../icons/minusremove.png";
import { useRegistrarPrato } from "../api/useRegistrarPratos";

export default function RegistrarPrato() {
  const { 
    produtos,
    loading, 
    erro, 
    categorias, 
    categoriaAtiva, 
    setCategoriaAtiva, 
    ingredientes, 
    setIngredientes, 
    form, 
    setForm, 
    adicionarIngrediente, 
    removerIngrediente, 
    salvarPrato, 
    produtosFiltrados, 
  } = useRegistrarPrato();

  if (loading) return <p>carregando insumos</p>;
  if (erro) return <p>Erro: {erro}</p>;

  return (
    <div className="registrar-prato-container">
      <div className="top-section">
        <div className="form-area">
          <h2>Registrar Prato</h2>
          <div className="inputs">
            <input type="text" placeholder="Nome do prato" value={form.nome_prato} onChange={(e) => setForm({ ...form, nome_prato: e.target.value })}/>
            <input type="number" placeholder="Valor do prato" value={form.valor_base_custo} onChange={(e) => setForm({ ...form, valor_base_custo: e.target.value })}/>
            <input type="text" placeholder="Tempo de preparo (min)" value={form.tempo_preparo} onChange={(e) => setForm({ ...form, tempo_preparo: e.target.value })}/>

            <select value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
              <option value="">Selecione uma categoria</option>
              <option value="Carnes">Carnes</option>
              <option value="Grãos">Grãos</option>
              <option value="Massas">Massas</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Sobremesas">Sobremesas</option>
              <option value="Lanches">Lanches</option>
              <option value="Aperitivos">Aperitivos</option>
            </select>
          </div>

          <button className="btn-salvar-prato" onClick={salvarPrato}>Salvar Prato</button>
        </div>

        <div className="ingredientes-area">
          <h2>Ingredientes</h2>
          <div className="ingredientes-header">
            <span>Nome</span>
            <span>Qtd</span>
            <span>Medida</span>
          </div>

          <div className="ingredientes-lista">
            {ingredientes.map((ing) => (
              <div key={ing.id} className="ingrediente-item">
                <span className="nome">{ing.nome}</span>
                <div className="qtd-controles">
                  <button onClick={() => removerIngrediente(ing)}><img src={Minus} alt="minus-icon" /></button>
                  <span>{ing.quantidade}</span>
                  <button onClick={() => adicionarIngrediente(ing)}><img src={Plus} alt="plus-icon" /></button>
                </div>
                <span className="medida">
                  <input type="number" className="input-medida" value={ing.valorMedida} onChange={(e) => {
                      const novaMedida = e.target.value;
                      setIngredientes((prev) =>
                        prev.map((i) =>
                          i.id === ing.id ? { ...i, valorMedida: novaMedida } : i
                        )
                      );
                    }}
                  />{ing.unidade}
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
            <button key={cat} className={`categoria-btn ${categoriaAtiva === cat ? "active" : ""}`} onClick={() => setCategoriaAtiva(cat)}>{cat}</button>
          ))}
        </div>

        <div className="produtos-scroll">
          <div className="grid-produtos">
            {produtosFiltrados.map((produto) => (
              <div key={produto.id} className="card-produto">
                <p className="nome-produto">{produto.nome}</p>
                <p className="quantidade-produto">Estoque: {produto.quantidade} {produto.unidadeMedida}</p>
                <p className="preco-produto"> Valor: {produto.valorTotal}</p>
                <div className="acoes">
                  <button className="btn remove" onClick={() => removerIngrediente(produto)}><img src={Minusremove} alt="minus-icon" /></button>
                  <button className="btn add" onClick={() => adicionarIngrediente(produto)}><img src={Plusadd} alt="plus-icon" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
