import { Router } from "express";
import { relatorioVendas } from "../controllers/relatorioVendasController.js";
import { relatorioVendasPDF } from "../controllers/relatorioVendaspdfController.js"
import { enviarPdfEmail } from "../controllers/enviarPdfEmailController.js";
import { autenticarToken, autorizar } from "../middlewares/autenticarTokenMiddleware.js";

const router = Router();

router.get("/vendas", autenticarToken, autorizar("Administrador", "Funcionario_Comum") , relatorioVendas);
router.get("/vendas/pdf", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), relatorioVendasPDF);
router.post("/vendas/pdf/email", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), enviarPdfEmail);

export default router;
