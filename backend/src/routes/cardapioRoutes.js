import express from "express";
import { atualizarDisponibilidade } from "../controllers/AtualizarStatusCardapioController.js";
import { getCardapioDoDia } from "../controllers/listarCardapioDoDiaController.js";
import { postAdicionarAoCardapio } from "../controllers/salvarCardapioDoDiaController.js";
import { listarCardapioDoDiaAtivo } from "../controllers/listarCardapioDoDiaAtivoController.js";
import { removerDoCardapio } from "../controllers/removerDoCardapioDodiaController.js";
import { CardapioVenda } from "../controllers/listarCardapioController.js";
import { autenticarToken, autorizar } from "../middlewares/autenticarTokenMiddleware.js";

const router = express.Router();

router.get("/cardapio-dia",autenticarToken, autorizar("Administrador", "Funcionario_Comum"), getCardapioDoDia);
router.get("/cardapio-dia/ativo",autenticarToken, autorizar("Administrador", "Funcionario_Comum"), listarCardapioDoDiaAtivo);
router.get("/cardapio-dia/vendas",autenticarToken, autorizar("Administrador", "Funcionario_Comum"), CardapioVenda);
router.post("/cardapio-dia/adicionar",autenticarToken, autorizar("Administrador", "Funcionario_Comum"), postAdicionarAoCardapio);
router.delete("/cardapio-dia/remover/:id",autenticarToken, autorizar("Administrador", "Funcionario_Comum"),removerDoCardapio);
router.put("/cardapio-dia/status/:id",autenticarToken, autorizar("Administrador", "Funcionario_Comum"), atualizarDisponibilidade);

export default router;


