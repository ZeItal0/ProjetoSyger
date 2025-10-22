import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import LoginRegistroRoutes from "./src/routes/LoginRegistroRoutes.js";
import { securityMiddleware } from "./src/middlewares/securityMiddleware.js";
import SidebarRoutes from "./src/routes/SidebarRoutes.js";


dotenv.config();

const app = express();
securityMiddleware(app);
app.use(cors());
app.use(express.json());

app.use("/LoginERegistro", LoginRegistroRoutes);
app.use("/api/sidebar", SidebarRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server rodando na porta ${PORT}`));

