import React from "react";
import "../assets/paginacao.css";
import right from "../icons/right.png";
import left from "../icons/left.png";

export default function Paginacao({ paginaAtual, totalPaginas, setPaginaAtual }) {
  return (
    <div className="paginacao">
      <button disabled={paginaAtual === 1} onClick={() => setPaginaAtual(paginaAtual - 1)}><img src={left}/> Anterior</button>

      <span>Página {paginaAtual} de {totalPaginas}</span>

      <button disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual(paginaAtual + 1)}>Próxima <img src={right}/></button>
    </div>
  );
}
