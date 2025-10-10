import React, { useState } from "react";
import "../assets/loginCadastro.css";
import sygerLogo from "../components/logo.png";
import { useNavigate } from "react-router-dom";

export default function LoginCadastro() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleTabClick = (isLoginMode) => {
    setIsLogin(isLoginMode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className={`login-container ${isLogin ? "login-mode" : "register-mode"}`}>
      
      <div className="left-panel">
        <div className="logo-section">
          <img src={sygerLogo} alt="Logo SYGER" className="logo-image" />
          <h1 className="logo-text">SYGER</h1>
        </div>

        <div className="tab-menu-wrapper">
          <div className={`tab ${isLogin ? "active" : ""}`} onClick={() => handleTabClick(true)}>LOGIN</div>
          <div className={`tab ${!isLogin ? "active" : ""}`} onClick={() => handleTabClick(false)}>SING IN</div>
        </div>
      </div>

      
      <div className="right-panel">
        <div className="login-form-box">
          
          <div className={`form-slide ${isLogin ? "active" : "hidden"}`}>
            <h1 className="text-login">LOGIN</h1>
            <form className="auth-form" onSubmit={handleSubmit}>

              <input type="text" placeholder="USUÁRIO" className="form-input" />
              <input type="password" placeholder="SENHA" className="form-input" />

              <button type="submit" className="enter-button">ENTRAR</button>

              <a href="#" className="forgot-password"> Esqueci minha senha</a>
            </form>
          </div>

        
          <div className={`form-slide ${!isLogin ? "active" : "hidden"}`}>

            <h1 className="text-login">SING IN</h1>

            <form className="auth-form" onSubmit={handleSubmit}>
              <input type="text" placeholder="NOME" className="form-input" />
              <input type="email" placeholder="E-MAIL" className="form-input" />
              <input type="text" placeholder="CNPJ" className="form-input" />
              <input type="text" placeholder="USUÁRIO" className="form-input" />
              <input type="password" placeholder="SENHA" className="form-input" />
              <button type="submit" className="enter-button">CADASTRAR</button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
