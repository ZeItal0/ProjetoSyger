import React, { useState } from "react";
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

const mockHistorico = [
    {
        id: 1,
        usuario: "Usuario nome | #01",
        acao: "Login",
        descricao: "Entrou no sistema",
        data: "dd/mm/yyyy",
        hora: "00:00",
        icone: "login"
    },
    {
        id: 2,
        usuario: "Usuario nome | #01",
        acao: "estorno",
        descricao: "estornou o pedido #00",
        data: "dd/mm/yyyy",
        hora: "00:00",
        icone: "alerta"
    },
    {
        id: 3,
        usuario: "Usuario nome | #01",
        acao: "venda",
        descricao: "realizou uma venda rápida",
        data: "dd/mm/yyyy",
        hora: "00:00",
        icone: "check"
    },
    {
        id: 4,
        usuario: "Usuario nome | #01",
        acao: "sair",
        descricao: "saiu do sistema",
        data: "dd/mm/yyyy",
        hora: "00:00",
        icone: "logout"
    },
    {
        id: 5,
        usuario: "Usuario nome | #01",
        acao: "editou",
        descricao: "editou um item do estoque Nome do item para novo Nome",
        data: "dd/mm/yyyy",
        hora: "00:00",
        icone: "edit"
    },
    {
        id: 6,
        usuario: "Usuario nome | #01",
        acao: "deletou",
        descricao: "deletou um item",
        data: "dd/mm/yyyy",
        hora: "00:00",
        icone: "delete"
    },
];


const IconeAtividade = ({ tipo }) => {
    let iconContent;
    switch (tipo) {
        case 'login':
            iconContent = <img src={entrar} className="icon-auditoria"/>;
            break;
        case 'alerta':
            iconContent = <img src={alerta} className="icon-auditoria"/>;
            break;
        case 'check':
            iconContent = <img src={check} className="icon-auditoria"/>;
            break;
        case 'logout':
            iconContent = <img src={sair} className="icon-auditoria"/>;
            break;
        case 'edit':
            iconContent = <img src={editar} className="icon-auditoria"/>;
            break;
        case 'delete':
            iconContent = <img src={excluir} className="icon-auditoria"/>;
            break;
        default:
            iconContent = <img src={entrar} className="icon-auditoria"/>;
    }
    return <div className={`icone-atividade icone-${tipo}`}>{iconContent}</div>;
};


export default function Historico() {
    const [activeItem, setActiveItem] = useState("Historico");
    const [filtroAcao, setFiltroAcao] = useState("Todas as ações");
    const [filtroUsuario, setFiltroUsuario] = useState("Todos os utilizadores");
    const [filtroData, setFiltroData] = useState("");

    const historicoFiltrado = mockHistorico.filter(item => {
        return true;
    });

    return (
        <div className="home-container">
            <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

            <div className="main-content-area">
                <MainHeader area="Historico"/>

                <main className="main-content historico-content">
                    <h1>Histórico de Atividades (Auditoria)</h1>

                    <div className="filtros-container">
                        <select value={filtroAcao} onChange={(e) => setFiltroAcao(e.target.value)}>
                            <option>Todas as ações</option>
                            <option>Login</option>
                            <option>Estorno</option>
                            <option>Venda</option>
                            <option>Sair</option>
                            <option>Edição</option>
                            <option>Deleção</option>
                        </select>

                        <select value={filtroUsuario} onChange={(e) => setFiltroUsuario(e.target.value)}>
                            <option>Todos os utilizadores</option>
                            <option>Usuario nome | #01</option>
                        </select>

                        <div className="input-data-container">
                            <input type="date" placeholder="dd/mm/yyyy" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} />
                            <span className="icone-calendario"></span>
                        </div>

                        <button className="btn-aplicar"><span className="icone-aplicar"></span>Aplicar</button>
                    </div>

                    <h2 className="titulo-atividades">Últimas {historicoFiltrado.length} atividades</h2>

                    <div className="historico-lista">
                        {historicoFiltrado.map(item => (
                            <div key={item.id} className="atividade-item">
                                <div className="atividade-icone-wrapper">
                                    <IconeAtividade tipo={item.icone} />
                                </div>
                                <div className="atividade-detalhes">
                                    <span className="atividade-usuario">{item.usuario}</span>
                                    <p className="atividade-descricao">
                                        <span className="atividade-acao">{item.acao}:</span> {item.descricao}
                                    </p>
                                </div>
                                <div className="atividade-data-hora">
                                    <span className="atividade-data">{item.data}</span>
                                    <span className="atividade-hora">{item.hora}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
