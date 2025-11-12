import express from "express";
import { obterMensagens } from "../controllers/mensagensController.js";
import { autenticarToken, autorizar } from "../middlewares/autenticarTokenMiddleware.js";

const router = express.Router();

router.get("/:idUsuario", autenticarToken, autorizar("Administrador", "Funcionario_Comum") ,obterMensagens);

export default router;
