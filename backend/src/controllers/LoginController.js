import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as LoginRegistroModel from "../models/LoginRegistroModel.js";
import { loginSchema } from "../validations/loginRegistroSchema.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const LoginController = async (req, res) => {
  const { usuario, senha } = req.body;
  try {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: error.details.map(d => d.message) });

    const user = await LoginRegistroModel.findUserByUsuario(usuario);
    if (!user) return res.status(404).json({ message: "usuario nao encontrado" });

    const isValid = await bcrypt.compare(senha, user.senha_hash);
    if (!isValid) return res.status(401).json({ message: "senha incorreta" });

    const token = jwt.sign({ id: user.id_usuario, usuario: user.usuario, nivel_acesso: user.nivel_acesso },JWT_SECRET,{ expiresIn: "2h" });

    res.json({
      message: "Bem vindo ao Siger",
      token,
      user: {
        id: user.id_usuario,
        nome: user.nome_completo,
        usuario: user.usuario,
        nivel_acesso: user.nivel_acesso,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};