import express from "express";
import { cadastrarInsumo } from "../controllers/RegistroInsumoController.js";
import { autenticarToken, autorizar } from "../middlewares/autenticarTokenMiddleware.js";
import { listarInsumos } from "../controllers/InventarioListarController.js";
import { atualizarInsumo } from "../controllers/AtualizarInsumoController.js";
import { deletarInsumo } from "../controllers/deleteInsumoController.js";

const router = express.Router();

router.post("/insumo", autenticarToken, autorizar("Administrador", "Funcionario_Comum") ,cadastrarInsumo);
router.get("/insumos", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), listarInsumos);
router.put("/insumo/:id", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), atualizarInsumo);
router.delete("/insumo/:id", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), deletarInsumo);

export default router;
