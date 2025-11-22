import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import "../assets/recuperacaoEmail.css";
import sygerLogo from "../components/logo.png";
import Glassbox from "../components/Glassbox";

export default function NovaSenha() {
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const token = location.state?.token;

    if (!token) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/recuperar/nova-senha", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    novaSenha: senha
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            alert("Senha redefinida com sucesso!");
            navigate("/", { replace: true, state: {} });

        } catch (err) {
            console.error(err);
            alert("Erro ao conectar com o servidor.");
        }
    };


    return (
        <div className="recuperacao-page-container">
            <div className="glass-container">
                <Glassbox>

                    <div className="logo-recuperacao">
                        <img src={sygerLogo} className="logo-icon" alt="Logo Syger" />
                    </div>

                    <h1 className="recuperacao-title">Nova Senha</h1>

                    <p className="recuperacao-instruction"> Digite sua nova senha .</p>

                    <form className="recuperacao-form" onSubmit={handleSubmit}>

                        <div className="input-email"><input type="password" placeholder="Nova senha" value={senha} onChange={(e) => setSenha(e.target.value)} required/></div>

                        <button type="submit" className="btn-enviar">SALVAR</button>
                    </form>

                </Glassbox>
            </div>
        </div>
    );
}
