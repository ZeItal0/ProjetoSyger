import express from "express";
import { listarEstoque, gerarInventarioPDF, gerarRelatorioReposicaoPDF } from "../controllers/relatorioEstoqueController.js";
import { autenticarToken, autorizar } from "../middlewares/autenticarTokenMiddleware.js";

const router = express.Router();

router.get("/estoque", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), listarEstoque);
router.get("/inventario", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), gerarInventarioPDF);
router.get("/reposicao", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), gerarRelatorioReposicaoPDF);


export default router;
