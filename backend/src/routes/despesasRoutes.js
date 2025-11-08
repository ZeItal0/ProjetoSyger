import express from "express";
import { criarDespesa } from "../controllers/DespesasControllers.js";
import { listarDespesas } from "../controllers/listarDespesasController.js";
import { atualizarDespesa } from "../controllers/atualizarDespesasController.js";
import { deletarDespesa } from "../controllers/deleteDespesasController.js";
import { autenticarToken, autorizar } from "../middlewares/autenticarTokenMiddleware.js";

const router = express.Router();

router.post("/criar", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), criarDespesa);
router.get("/listar", autenticarToken, listarDespesas);
router.put("/atualizar/:id", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), atualizarDespesa);
router.delete("/deletar/:id", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), deletarDespesa);


export default router;
