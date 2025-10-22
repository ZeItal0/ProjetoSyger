import express from "express";
import { autenticarToken, autorizar } from "../middlewares/autenticarTokenMiddleware.js";

const router = express.Router();

router.get("/dashboard", autenticarToken, autorizar("Administrador", "Funcionario_Comum", "Financeiro_Gerente"), (req, res) => {
  res.json({nivelAcesso: req.usuario.nivel_acesso,});
});

router.get("/estoque", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), (req, res) => {
  res.json({nivelAcesso: req.usuario.nivel_acesso,});
});

export default router;
