import express from "express";
import { RegistroController } from "../controllers/RegistroController.js";
import { LoginController } from "../controllers/LoginController.js";

const router = express.Router();

router.post("/register", RegistroController);
router.post("/login", LoginController);

export default router;
