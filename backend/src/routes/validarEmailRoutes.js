import express from "express";
import { validarEmailRecuperacao } from "../controllers/validarEmailRecuperacaoController.js";
import { gerarCodigoRecuperacao } from "../controllers/gerarCodigoRecuperacaoController.js";
import { validarCodigo } from "../controllers/validarCodigoController.js";
import { redefinirSenha } from "../controllers/redefinirSenhaController.js";

const router = express.Router();

router.post("/validar-email", validarEmailRecuperacao);
router.post("/gerar-codigo", gerarCodigoRecuperacao);
router.post("/validar-codigo", validarCodigo);
router.post("/nova-senha", redefinirSenha);

export default router;
