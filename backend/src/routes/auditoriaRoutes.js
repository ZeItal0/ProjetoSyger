import express from "express";

import { listarHistoricoAuditoria } from "../controllers/listarAuditoriaController.js";
import { autenticarToken, autorizar } from "../middlewares/autenticarTokenMiddleware.js";

const router = express.Router();

router.get("/listar",autenticarToken, autorizar("Administrador"), listarHistoricoAuditoria);


export default router;


