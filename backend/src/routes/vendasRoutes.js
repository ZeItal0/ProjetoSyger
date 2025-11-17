import express from "express";
import { finalizarVenda } from "../controllers/vendaController.js";
import { listarMesasAbertas, criarMesa, adicionarItemMesa, removerItemMesa, finalizarMesa } from "../controllers/mesaController.js"
import { criarMarmita, listarMarmitas, adicionarItemMarmita, removerItemMarmita, finalizarMarmita  } from "../controllers/marmitasController.js";
import { autenticarToken, autorizar } from "../middlewares/autenticarTokenMiddleware.js";

const router = express.Router();

router.post( "/finalizar", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), finalizarVenda);
router.get("/mesas/abertas", autenticarToken, autorizar("Administrador","Funcionario_Comum"), listarMesasAbertas);
router.post("/mesas", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), criarMesa);
router.post("/mesas/:id_mesa/adicionar-item",autenticarToken, autorizar("Administrador", "Funcionario_Comum"),adicionarItemMesa);
router.delete("/mesas/:id_mesa/remover-item/:id_item_pedido",autenticarToken, autorizar("Administrador", "Funcionario_Comum"),removerItemMesa);
router.post("/mesas/:id_mesa/finalizar", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), finalizarMesa);

router.post("/marmitas", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), criarMarmita);
router.get("/listar/marmitas", autenticarToken, autorizar("Administrador","Funcionario_Comum"), listarMarmitas);
router.post("/marmitas/:id_marmita/adicionar-item",autenticarToken, autorizar("Administrador", "Funcionario_Comum"), adicionarItemMarmita);
router.delete("/marmitas/:id_marmita/remover-item/:id_item_pedido",autenticarToken, autorizar("Administrador", "Funcionario_Comum"),removerItemMarmita);
router.post("/marmitas/:id_marmita/finalizar", autenticarToken, autorizar("Administrador", "Funcionario_Comum"), finalizarMarmita);

export default router;

