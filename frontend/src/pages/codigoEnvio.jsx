import React, { useState, useRef } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import "../assets/recuperacaoCodigo.css";
import sygerLogo from "../components/logo.png";
import Glassbox from "../components/Glassbox";

export default function RecuperacaoCodigo() {
    const [code, setCode] = useState(new Array(6).fill(""));
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    if (!email) {
        return <Navigate to="/" replace />;
    }

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newCode = [...code];
        newCode[index] = element.value;
        setCode(newCode);

        if (element.value !== "" && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && index > 0 && code[index] === "") {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fullCode = code.join("");

        try {
            const res = await fetch("http://localhost:5000/recuperar/validar-codigo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, codigo: fullCode })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Código inválido.");
                return;
            }

            navigate("/recuperar-nova-senha", { replace: true, state: { token: data.token } });

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
                        <img src={sygerLogo} className="logo-icon-codigo" alt="Logo Syger" />
                    </div>

                    <h1 className="recuperacao-title">Código de Verificação</h1>

                    <p className="recuperacao-instruction">Para redefinir a sua senha, informe o código enviado por email.</p>

                    <form className="recuperacao-form-codigo" onSubmit={handleSubmit}>
                        <div className="code-input-container">
                            {code.map((data, index) => (
                                <input
                                    key={index}
                                    className="code-input"
                                    type="text"
                                    maxLength="1"
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    ref={el => inputRefs.current[index] = el}
                                />
                            ))}
                        </div>

                        <button type="submit" className="btn-confirmar">
                            CONFIRMAR
                        </button>
                    </form>

                </Glassbox>
            </div>
        </div>
    );
}
