import express from "express";
import { autenticarToken, autorizar } from "../middlewares/autenticarTokenMiddleware.js";

const router = express.Router();

router.get("/dashboard", autenticarToken, autorizar("Administrador", "Funcionario_Comum", "Financeiro_Gerente"), (req, res) => {
  res.json({nivelAcesso: req.usuario.nivel_acesso,});
});

router.get("/estoque", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), (req, res) => {
  res.json({nivelAcesso: req.usuario.nivel_acesso,});
});

router.get("/pratos", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), (req, res) => {
  res.json({nivelAcesso: req.usuario.nivel_acesso,});
});

router.get("/vendas", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), (req, res) => {
  res.json({nivelAcesso: req.usuario.nivel_acesso,});
});

router.get("/financeiro", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), (req, res) => {
  res.json({nivelAcesso: req.usuario.nivel_acesso,});
});

router.get("/relatorio", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), (req, res) => {
  res.json({nivelAcesso: req.usuario.nivel_acesso,});
});

router.get("/historico", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), (req, res) => {
  res.json({nivelAcesso: req.usuario.nivel_acesso,});
});

router.get("/usuarios", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), (req, res) => {
  res.json({nivelAcesso: req.usuario.nivel_acesso,});
});


export default router;
