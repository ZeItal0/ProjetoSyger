import express from "express";
import { registrarPrato } from "../controllers/RegistrarPratoController.js";
import { autenticarToken, autorizar } from "../middlewares/autenticarTokenMiddleware.js";
import { removerVariacao } from "../controllers/removerPratoVariacoesController.js";
import { listarPratos } from "../controllers/listarPratoVariacoesController.js";
import { salvarVariacoes } from "../controllers/salvarPratoVariacoesController.js";

const router = express.Router();

router.get("/listar", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), listarPratos);
router.post("/salvarVariacoes", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), salvarVariacoes);
router.post("/criar", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), registrarPrato);
router.delete( "/removerVariacao/:id_variacao", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), removerVariacao);
export default router;
