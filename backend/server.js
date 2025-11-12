import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import LoginRegistroRoutes from "./src/routes/LoginRegistroRoutes.js";
import FornecedoresRoutes from "./src/routes/fornecedoresRoutes.js";
import { securityMiddleware } from "./src/middlewares/securityMiddleware.js";
import SidebarRoutes from "./src/routes/SidebarRoutes.js";
import ProdutoRoutes from "./src/routes/produtosRoutes.js";
import pratosRoutes from "./src/routes/pratosRoutes.js";
import cardapioRoutes from "./src/routes/cardapioRoutes.js";
import despesasRoutes from "./src/routes/despesasRoutes.js";
import auditoriaRoutes from "./src/routes/auditoriaRoutes.js";
import usuariosRoutes from "./src/routes/usuariosRoutes.js";
import { inicializarSocket } from "./socketServer.js";
import mensagensRoutes from "./src/routes/mensagensRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

securityMiddleware(app);

app.use(cors({ origin: "http://localhost:5173", credentials: true,}));
app.use(express.json());

app.use("/cardapio", cardapioRoutes);
app.use("/LoginERegistro", LoginRegistroRoutes);
app.use("/api/sidebar", SidebarRoutes);
app.use("/cadastro", FornecedoresRoutes);
app.use("/cadastroProduto", ProdutoRoutes);
app.use("/pratos", pratosRoutes);
app.use("/despesas", despesasRoutes);
app.use("/auditoria", auditoriaRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/mensagens", mensagensRoutes);

inicializarSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
