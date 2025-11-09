import express from "express";

import { listarHistoricoAuditoria } from "../controllers/listarAuditoriaController.js";
import { autenticarToken, autorizar } from "../middlewares/autenticarTokenMiddleware.js";

const router = express.Router();

router.get("/listar",autenticarToken, autorizar("Administrador", "Funcionario_Comum"), listarHistoricoAuditoria);


export default router;


