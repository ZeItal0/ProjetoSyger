
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import "../assets/home.css";
import "../assets/controles.css";
import enviar from "../icons/send.png";
import pause from "../icons/pause.png";
import deleteUser from "../icons/recycle-user.png";
import ativarUser from "../icons/check-mark.png";
import autorizar from "../icons/check-mark-Green.png";

const mockUsuarios = [
    { id: '#001', nome: 'Nome do utilizador', email: 'Email', registro: 'dd/mm/yyyy', status: 'Ativo' },
    { id: '#002', nome: 'Nome do utilizador', email: 'Email', registro: 'dd/mm/yyyy', status: 'Suspenso' },
    { id: '#003', nome: 'Nome do utilizador', email: 'Email', registro: 'dd/mm/yyyy', status: 'Inativo' },
];


const mockNotificacoes = [
    { id: 1, mensagem: 'Mensagem', data: 'dd/mm/yyyy', hora: '00:00' },
    { id: 2, mensagem: 'Mensagem', data: 'dd/mm/yyyy', hora: '00:00' },
    { id: 3, mensagem: 'Mensagem', data: 'dd/mm/yyyy', hora: '00:00' },
    { id: 4, mensagem: 'Mensagem', data: 'dd/mm/yyyy', hora: '00:00' },
    { id: 5, mensagem: 'Mensagem', data: 'dd/mm/yyyy', hora: '00:00' },
    { id: 6, mensagem: 'Mensagem', data: 'dd/mm/yyyy', hora: '00:00' },
];

const UsuarioRow = ({ usuario }) => {
    const getStatusClass = (status) => {
        switch (status) {
            case 'Ativo': return 'status-ativo';
            case 'Suspenso': return 'status-suspenso';
            case 'Inativo': return 'status-inativo';
            default: return '';
        }
    };

    const getActionIcons = (status) => {
        if (status === 'Ativo') {
            return (
                <>
                    <img src={pause} className="action-icon icon-pause-conta"/>
                    <img src={deleteUser} className="action-icon icon-delete-deleteUser"/>
                </>
            );
        } else if (status === 'Suspenso') {
            return (
                <>
                    <img src={ativarUser} className="action-icon icon-check-desative-suspensao"/>
                    <img src={deleteUser} className="action-icon icon-delete-deleteUser"/>
                </>
            );
        } else if (status === 'Inativo') {
            return (
                <>
                    <img src={autorizar} className="action-icon icon-check-autorizar"/>
                    <img src={deleteUser} className="action-icon icon-delete-deleteUser"/>
                </>
            );
        }
        return null;
    };

    return (
        <div className="usuario-row">
            <div className="usuario-info">
                <span className="usuario-nome">{usuario.nome} {usuario.email}</span>
            </div>
            <span className="usuario-id">{usuario.id}</span>
            <span className="usuario-registro">{usuario.registro}</span>
            <span className={`usuario-status ${getStatusClass(usuario.status)}`}>{usuario.status}</span>
            <div className="usuario-acoes">
                {getActionIcons(usuario.status)}
            </div>
        </div>
    );
};


export default function Controles() {
    const [activeItem, setActiveItem] = useState("Controles");
    const [destinatario, setDestinatario] = useState("Todos os Utilizadores Ativos");
    const [mensagem, setMensagem] = useState("");

    const handleEnviarNotificacao = () => {
        if (mensagem.trim() === "") {
            alert("A mensagem não pode estar vazia.");
            return;
        }
        console.log(`Enviando notificação para ${destinatario}: ${mensagem}`);
        alert(`Notificação enviada para ${destinatario}!`);
        setMensagem("");
    };

    return (
        <div className="home-container">
            <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

            <div className="main-content-area">
                <MainHeader area="Controles"/>

                <main className="main-content controles-content">
                    <h1>Controles Administrativos</h1>

                    <section className="secao-notificacoes">
                        <h2>Envio de Notificações</h2>
                        <div className="notificacoes-grid">
                            <div className="notificacoes-form">
                                <label htmlFor="destinatario">Enviar para:</label>
                                <select id="destinatario" value={destinatario} onChange={(e) => setDestinatario(e.target.value)}>
                                    <option>Todos os Utilizadores Ativos</option>
                                    <option>Utilizador Específico</option>
                                </select>

                                <label htmlFor="mensagem">Mensagem de Notificação</label>
                                <textarea id="mensagem" placeholder="Escreva a sua mensagem aqui" value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows="5"/>

                                <button className="btn-enviar-notificacao" onClick={handleEnviarNotificacao}><img src={enviar}/> Enviar Notificação</button>
                            </div>

                            <div className="historico-notificacoes">
                                <h3>Histórico de Notificações para | Nome do Usuario</h3>
                                <div className="historico-list">
                                    {mockNotificacoes.map(notif => (
                                        <div key={notif.id} className="notificacao-item">
                                            <div className="notificacao-detalhes">
                                                <span className="notificacao-mensagem">{notif.mensagem}</span>
                                                <span className="notificacao-data-hora">{notif.hora} {notif.data}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="secao-gestao-utilizadores">
                        <h2>Gestão de utilizadores</h2>
                        <div className="tabela-utilizadores">
                            <div className="tabela-header">
                                <span>NOME / EMAIL</span>
                                <span>ID</span>
                                <span>REGISTRO</span>
                                <span>STATUS</span>
                                <span>AÇÕES</span>
                            </div>
                            {mockUsuarios.map(usuario => (
                                <UsuarioRow key={usuario.id} usuario={usuario} />
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
