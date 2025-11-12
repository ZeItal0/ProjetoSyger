import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import "../assets/home.css";
import "../assets/controles.css";
import enviar from "../icons/send.png";
import pause from "../icons/pause.png";
import deleteUser from "../icons/recycle-user.png";
import ativarUser from "../icons/check-mark.png";
import autorizar from "../icons/check-mark-Green.png";
import Paginacao from "../components/paginacaoComponent";
import useGestao from "../api/useGestao";

const UsuarioRow = ({ usuario, onPausar, onReativar, onAutorizar, onExcluir }) => {
    const getStatusClass = (status) => {
        switch (status) {
            case "Ativo":
                return "status-ativo";
            case "Suspenso":
                return "status-suspenso";
            case "Inativo":
                return "status-inativo";
            default:
                return "";
        }
    };

    const getActionIcons = (status) => {
        if (status === "Ativo") {
            return (
                <>
                    <img src={pause} className="action-icon icon-pause-conta" onClick={() => onPausar(usuario)} title="Pausar conta" />
                    <img src={deleteUser} className="action-icon icon-delete-deleteUser" onClick={() => onExcluir(usuario)} title="Marcar como Inativa" />
                </>
            );
        } else if (status === "Suspenso") {
            return (
                <>
                    <img src={ativarUser} className="action-icon icon-check-desative-suspensao" onClick={() => onReativar(usuario)} title="Reativar conta" />
                    <img src={deleteUser} className="action-icon icon-delete-deleteUser" onClick={() => onExcluir(usuario)} title="Marcar como Inativa" />
                </>
            );
        } else if (status === "Inativo") {
            return (
                <>
                    <img src={autorizar} className="action-icon icon-check-autorizar" onClick={() => onAutorizar(usuario)} title="Autorizar conta" />
                </>
            );
        }
        return null;
    };

    return (
        <div className="usuario-row">
            <div className="usuario-info">
                <span className="usuario-nome">
                    {usuario.nome} ({usuario.email})
                </span>
            </div>
            <span className="usuario-id">{usuario.id}</span>
            <span className="usuario-registro">{usuario.registro}</span>
            <span className={`usuario-status ${getStatusClass(usuario.status)}`}>
                {usuario.status}
            </span>
            <div className="usuario-acoes">{getActionIcons(usuario.status)}</div>
        </div>
    );
};


export default function Controles() {
    const {
    activeItem, setActiveItem,
    usuarios, paginaAtual, setPaginaAtual, totalPaginas, loading,
    usuariosAtivos, destinatario, setDestinatario,
    mensagem, setMensagem, historico,
    handlePausarUsuario, handleReativarUsuario,
    handleAutorizarUsuario, handleExcluirUsuario,
    handleEnviarNotificacao,
  } = useGestao();

    return (
        <div className="home-container">
            <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

            <div className="main-content-area">
                <MainHeader area="Controles" />

                <main className="main-content controles-content">
                    <h1>Controles Administrativos</h1>

                    <section className="secao-notificacoes">
                        <h2>Envio de Notificações</h2>
                        <div className="notificacoes-grid">
                            <div className="notificacoes-form">
                                <label htmlFor="destinatario">Enviar para:</label>
                                <select id="destinatario" value={destinatario} onChange={(e) => setDestinatario(e.target.value)}>
                                    <option value="Todos os Utilizadores Ativos">Todos os Utilizadores Ativos</option>
                                    {usuariosAtivos.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.id}-{user.nome}
                                        </option>
                                    ))}
                                </select>


                                <label htmlFor="mensagem">Mensagem de Notificação</label>
                                <textarea id="mensagem" placeholder="Escreva a sua mensagem aqui" value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows="5" />

                                <button className="btn-enviar-notificacao" onClick={handleEnviarNotificacao}>
                                    <img src={enviar} alt="enviar" /> Enviar Notificação
                                </button>
                            </div>

                            <div className="historico-notificacoes">
                                <h3>Histórico de Notificações</h3>
                                <div className="historico-list">
                                    {historico.length === 0 ? (
                                        <p>Nenhuma mensagem encontrada.</p>
                                    ) : (
                                        historico.map((msg) => (
                                            <div key={msg.id_mensagem} className="notificacao-item">
                                                <div className="notificacao-detalhes">
                                                    <span className="notificacao-mensagem">{msg.conteudo}</span>
                                                    <span className="notificacao-data-hora">
                                                        {new Date(msg.data_envio).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                        </div>
                    </section>

                    <section className="secao-gestao-utilizadores">
                        <h2>Gestão de Utilizadores</h2>

                        {loading ? (
                            <p>carregando usuarios</p>
                        ) : (
                            <div className="tabela-utilizadores">
                                <div className="tabela-header">
                                    <span>NOME / EMAIL</span>
                                    <span>ID</span>
                                    <span>REGISTRO</span>
                                    <span>STATUS</span>
                                    <span>AÇÕES</span>
                                </div>

                                {usuarios.length > 0 ? (
                                    usuarios.map((usuario) => (
                                        <UsuarioRow
                                            key={usuario.id}
                                            usuario={usuario}
                                            onPausar={handlePausarUsuario}
                                            onReativar={handleReativarUsuario}
                                            onAutorizar={handleAutorizarUsuario}
                                            onExcluir={handleExcluirUsuario}
                                        />
                                    ))
                                ) : (
                                    <p>nenhum usuario encontrado</p>
                                )}
                            </div>
                        )}
                        <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} setPaginaAtual={setPaginaAtual} />
                    </section>
                </main>
            </div>
        </div>
    );
}
