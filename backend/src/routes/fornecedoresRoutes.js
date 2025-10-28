import express from "express";
import { criarFornecedor } from "../controllers/fornecedoresController.js";
import { listarFornecedores } from "../controllers/ListarFornecedorController.js";
import { autenticarToken, autorizar } from "../middlewares/autenticarTokenMiddleware.js";

const router = express.Router();

router.post("/Fornecedor",autenticarToken,autorizar("Administrador", "Funcionario_Comum"),criarFornecedor);
router.get( "/Listarfornecedores", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), listarFornecedores);

export default router;
