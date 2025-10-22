import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as LoginRegistroModel from "../models/LoginRegistroModel.js";
import { registerSchema, loginSchema } from "../validations/loginRegistroValidation.js";

const JWT_SECRET = process.env.JWT_SECRET || "bdf43365";

export const RegistroController = async (req, res) => {
  const { nome_completo, email, usuario, cnpj, senha } = req.body;
  try {

    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: error.details.map(d => d.message) });

    const existingUser = await LoginRegistroModel.findUserByEmailOrUsuario(email, usuario);
    if (existingUser) return res.status(400).json({ message: "usuario nao encontrado" });

    const senha_hash = await bcrypt.hash(senha, 10);

    await LoginRegistroModel.createUser({
      nome_completo,
      email,
      usuario,
      cnpj,
      senha_hash,
      cargo: "Funcionario",
      nivel_acesso: "Funcionario_Comum",
      status: "Ativo",
    });

    res.status(201).json({ message: "cadastro realizado, o adm vai verificar sua autorizacao" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const LoginController = async (req, res) => {
  const { usuario, senha } = req.body;
  try {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: error.details.map(d => d.message) });

    const user = await LoginRegistroModel.findUserByUsuario(usuario);
    if (!user) return res.status(404).json({ message: "usuario nao encontrado" });

    const isValid = await bcrypt.compare(senha, user.senha_hash);
    if (!isValid) return res.status(401).json({ message: "senha incorreta" });

    const token = jwt.sign({ id: user.id_usuario, usuario: user.usuario, nivel_acesso: user.nivel_acesso },JWT_SECRET,{ expiresIn: "1h" });

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

