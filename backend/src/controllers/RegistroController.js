import bcrypt from "bcryptjs";
import * as LoginRegistroModel from "../models/LoginRegistroModel.js";
import { registerSchema } from "../validations/loginRegistroSchema.js";

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

