import express from "express";
import { RegistroController, LoginController } from "../controllers/LoginRegistroController.js";

const router = express.Router();

router.post("/register", RegistroController);
router.post("/login", LoginController);

export default router;
