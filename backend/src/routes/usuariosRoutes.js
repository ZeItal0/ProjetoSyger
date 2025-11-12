import express from "express";
import { listarUsuariosController, pausarUsuarioController, reativarUsuarioController, autorizarUsuarioController,  excluirUsuarioController, listarUsuariosAtivosController } from "../controllers/usuariosController.js";
import { autenticarToken, autorizar } from "../middlewares/autenticarTokenMiddleware.js";

const router = express.Router();

router.get("/listar", autenticarToken, autorizar("Administrador"), listarUsuariosController);
router.put("/pausar/:id", autenticarToken, autorizar("Administrador"), pausarUsuarioController);
router.put("/reativar/:id", autenticarToken, autorizar("Administrador"), reativarUsuarioController);
router.put("/autorizar/:id", autenticarToken, autorizar("Administrador"), autorizarUsuarioController);
router.delete("/excluir/:id", autenticarToken, autorizar("Administrador"), excluirUsuarioController);
router.get("/ativos", autenticarToken, autorizar("Administrador"), listarUsuariosAtivosController)



export default router;
