import React from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import "../assets/home.css";
import "../assets/historicoAuditoria.css";
import entrar from "../icons/userA.png";
import alerta from "../icons/alertA.png";
import check from "../icons/checkA.png";
import editar from "../icons/editA.png";
import sair from "../icons/exitA.png";
import excluir from "../icons/recycleA.png";
import { useAuditoria } from "../api/useAuditoria";
import Paginacao from "../components/paginacaoComponent";

const IconeAtividade = ({ tipo }) => {
  const acao = tipo?.toLowerCase();
  let icon;

  if (acao.includes("login")) icon = entrar;
  else if (acao.includes("logout") || acao.includes("sair")) icon = sair;
  else if (acao.includes("atualizou") || acao.includes("edit")) icon = editar;
  else if (acao.includes("deletou") || acao.includes("delete")) icon = excluir;
  else if (acao.includes("cadastro") || acao.includes("venda")) icon = check;
  else icon = alerta;

  return <img src={icon} className="icon-auditoria" alt={tipo} />;
};

export default function Historico() {
  const {
    historicoFiltrado,
    usuariosUnicos,
    loading,
    filtroAcao,
    filtroUsuario,
    filtroData,
    setFiltroAcao,
    setFiltroUsuario,
    setFiltroData,
    paginaAtual,
    setPaginaAtual,
    totalPaginas,
  } = useAuditoria();

  const [activeItem, setActiveItem] = React.useState("Historico");

  return (
    <div className="home-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="main-content-area">
        <MainHeader area="Histórico" />

        <main className="main-content historico-content">
          <h1>Histórico de Atividades (Auditoria)</h1>

          <div className="filtros-container">
            <select value={filtroAcao} onChange={(e) => setFiltroAcao(e.target.value)}>
              <option>Todas as ações</option>
              <option>LOGIN</option>
              <option>CADASTRO</option>
              <option>ATUALIZOU</option>
              <option>DELETOU</option>
              <option>LOGOUT</option>
            </select>

            <select value={filtroUsuario} onChange={(e) => setFiltroUsuario(e.target.value)}>
              {usuariosUnicos.map((usuario, i) => (
                <option key={i}>{usuario}</option>
              ))}
            </select>

            <div className="input-data-container">
              <input type="date" value={filtroData} onChange={(e) => setFiltroData(e.target.value)}/>
              <span className="icone-calendario"></span>
            </div>
          </div>

          {loading ? (
            <p>Carregando histórico...</p>
          ) : historicoFiltrado.length === 0 ? (
            <p>Nenhum registro encontrado.</p>
          ) : (
            <>
              <h2 className="titulo-atividades"> Últimas {historicoFiltrado.length} atividades</h2>

              <div className="historico-lista">
                {historicoFiltrado.map((item) => (
                  <div key={item.id} className="atividade-item">
                    <div className="atividade-icone-wrapper">
                      <IconeAtividade tipo={item.acao} />
                    </div>
                    <div className="atividade-detalhes">
                      <span className="atividade-usuario">{item.usuario}</span>
                      <p className="atividade-descricao">
                        <span className="atividade-acao">{item.acao}:</span>{" "}
                        {item.descricao}
                      </p>
                    </div>
                    <div className="atividade-data-hora">
                      <span className="atividade-data">{item.data}</span>
                      <span className="atividade-hora">{item.hora}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} setPaginaAtual={setPaginaAtual}/>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
