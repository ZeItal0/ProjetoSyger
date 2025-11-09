import express from "express";
import { RegistroController } from "../controllers/RegistroController.js";
import { LoginController } from "../controllers/LoginController.js";
import { LogoutController } from "../controllers/LogoutController.js"
import { autenticarToken } from "../middlewares/autenticarTokenMiddleware.js";

const router = express.Router();

router.post("/register", RegistroController);
router.post("/login", LoginController);
router.post("/logout", autenticarToken, LogoutController);

export default router;
