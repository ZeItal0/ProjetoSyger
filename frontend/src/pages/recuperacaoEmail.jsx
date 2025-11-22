import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/recuperacaoEmail.css";
import sygerLogo from "../components/logo.png";
import Glassbox from "../components/Glassbox"

export default function RecuperacaoEmail() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/recuperar/validar-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Email não encontrado.");
                return;
            }

            const res2 = await fetch("http://localhost:5000/recuperar/gerar-codigo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data2 = await res2.json();

            if (!res2.ok) {
                alert(data2.message || "erro ao gerar código.");
                return;
            }
            navigate("/recuperar-codigo", { state: { email } });
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

                    <h1 className="recuperacao-title">Recuperação de Senha</h1>

                    <p className="recuperacao-instruction">
                        Para recuperar a sua senha, informe seu endereço de email que nós
                        enviaremos um código para alteração da senha.
                    </p>

                    <form className="recuperacao-form" onSubmit={handleSubmit}>
                        <div className="input-email">
                            <input
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-enviar"> ENVIAR </button>
                    </form>

                </Glassbox>
            </div>
        </div>
    );
}
