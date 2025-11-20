import express from "express";
import { dashboardData } from "../controllers/dashBoardController.js";
import { autenticarToken, autorizar } from "../middlewares/autenticarTokenMiddleware.js";

const router = express.Router();

router.get("/", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), dashboardData);

export default router;
