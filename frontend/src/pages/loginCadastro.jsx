import React, { useState } from "react";
import "../assets/loginCadastro.css";
import sygerLogo from "../components/logo.png";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/loginCadastro";

export default function LoginCadastro() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleTabClick = (isLoginMode) => {
    setIsLogin(isLoginMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      let result;
      if (isLogin) {
        result = await login(data.USUARIO, data.SENHA);
        localStorage.setItem("token", result.token);
        localStorage.setItem("nome_usuario", result.user.nome);
        localStorage.setItem("nivel_acesso", result.user.nivel_acesso);
        alert(result.message);
        navigate("/home");
      } else {
        result = await register({
          nome_completo: data.NOME,
          email: data["E-MAIL"],
          cnpj: data.CNPJ,
          usuario: data.USUARIO,
          senha: data.SENHA,
        });
        alert(result.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={`login-container ${isLogin ? "login-mode" : "register-mode"}`}>

      <div className="left-panel">

        <div className="waves-background">
          <svg className="waves" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="parallax">
              <use href="#gentle-wave" x="48" y="0" fill="#FF7855" />
              <use href="#gentle-wave" x="48" y="3" fill="#965E4F" />
              <use href="#gentle-wave" x="48" y="5" fill="#FF987E" />
              <use href="#gentle-wave" x="48" y="7" fill="#f5f5f5a4" />
            </g>
          </svg>
        </div>

        <div className="logo-section">
          <img src={sygerLogo} alt="Logo SYGER" className="logo-image" />
        </div>


        <div className="tab-menu-wrapper">
          <div className={`tab ${isLogin ? "active" : ""}`} onClick={() => handleTabClick(true)}>LOGIN</div>
          <div className={`tab ${!isLogin ? "active" : ""}`} onClick={() => handleTabClick(false)}>CADASTRO</div>
        </div>

      </div>

      <div className="right-panel">
        <div className="login-form-box">

          <div className={`form-slide ${isLogin ? "active" : "hidden"}`}>
            <h1 className="text-login">LOGIN</h1>
            <form className="auth-form" onSubmit={handleSubmit}>

              <input type="text" name="USUARIO" placeholder="USUÁRIO" className="form-input" />
              <input type="password" name="SENHA" placeholder="SENHA" className="form-input" />


              <button type="submit" className="enter-button">ENTRAR</button>

              <a href="#" className="forgot-password"> Esqueci minha senha</a>
            </form>
          </div>


          <div className={`form-slide ${!isLogin ? "active" : "hidden"}`}>

            <h1 className="text-login">CADASTRO</h1>

            <form className="auth-form" onSubmit={handleSubmit}>
              <input type="text" name="NOME" placeholder="NOME" className="form-input" />
              <input type="email" name="E-MAIL" placeholder="E-MAIL" className="form-input" />
              <input type="text" name="CNPJ" placeholder="CNPJ" className="form-input" />
              <input type="text" name="USUARIO" placeholder="USUÁRIO" className="form-input" />
              <input type="password" name="SENHA" placeholder="SENHA" className="form-input" />

              <button type="submit" className="enter-button">CADASTRAR</button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
