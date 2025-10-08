import React, { useState } from "react";
import "../assets/loginCadastro.css";
import sygerLogo from"../components/logo.png"
import {useNavigate} from 'react-router-dom';

export default function loginCadastro() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleTabClick = (isLoginMode) => {
    setIsLogin(isLoginMode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/home")
  };

  return (
    <div className={`login-container ${isLogin ? "login-mode" : "register-mode"}`}>
      <div className="left-panel">
        <div className="tab-menu-wrapper">
          
          <div className={`tab ${isLogin ? "active" : ""}`} onClick={() => handleTabClick(true)}>LOGIN</div>

          <div className={`tab ${!isLogin ? "active" : "singin"}`} onClick={() => handleTabClick(false)}>SING IN</div>

        </div>
      </div>

    
      <div className="right-panel">
        <div className="login-form-box">
          <div className="logo-section">
            <div className="logo-cubes">
                <img src={sygerLogo} alt="Logo SYGER - Cubos" className="logo-image" />
            </div>
            <h1 className="logo-text">SYGER</h1>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input type="text" placeholder="NAME" className="form-input" />
                <input type="email" placeholder="E-MAIL" className="form-input" />
                <input type="text" placeholder="CNPJ" className="form-input" />
              </>
            )}

            <input type="text" placeholder="USER" className="form-input" />
            <input type="password" placeholder="PASSWORD" className="form-input" />

            <button type="submit" className="enter-button">
              {isLogin ? "ENTER" : "CADASTRAR"}
            </button>

            {isLogin && (
              <a href="#" className="forgot-password"> Esqueci minha senha </a>
            )}
          </form>
          
        </div>
      </div>
    </div>
  );
}