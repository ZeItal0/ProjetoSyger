import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import LoginRegistroRoutes from "./src/routes/LoginRegistroRoutes.js";
import FornecedoresRoutes from "./src/routes/fornecedoresRoutes.js"
import { securityMiddleware } from "./src/middlewares/securityMiddleware.js";
import SidebarRoutes from "./src/routes/SidebarRoutes.js";
import ProdutoRoutes from "./src/routes/produtosRoutes.js"
import pratosRoutes from "./src/routes/pratosRoutes.js"
import cardapioRoutes from "./src/routes/cardapioRoutes.js";
import despesasRoutes from "./src/routes/despesasRoutes.js"

dotenv.config();

const app = express();
securityMiddleware(app);
app.use(cors());
app.use(express.json());
app.use("/cardapio", cardapioRoutes);
app.use("/LoginERegistro", LoginRegistroRoutes);
app.use("/api/sidebar", SidebarRoutes);
app.use("/cadastro", FornecedoresRoutes);
app.use("/cadastroProduto", ProdutoRoutes);
app.use("/pratos", pratosRoutes);
app.use("/despesas", despesasRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server rodando na porta ${PORT}`));

