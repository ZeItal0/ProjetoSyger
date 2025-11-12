import bcrypt from "bcryptjs";
import * as LoginRegistroModel from "../models/LoginRegistroModel.js";
import { registerSchema } from "../validations/loginRegistroSchema.js";
import { registrarAuditoria } from "../utils/registrarAuditoria.js";

export const RegistroController = async (req, res) => {
  const { nome_completo, email, usuario, cnpj, senha } = req.body;

  try {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.details.map(d => d.message) });
    }

    const existingUser = await LoginRegistroModel.findUserByEmailOrUsuario(email, usuario);
    if (existingUser) {
      return res.status(400).json({ message: "usuario nao pode ser cadastrado" });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const novoUsuario = await LoginRegistroModel.createUser({
      nome_completo,
      email,
      usuario,
      cnpj,
      senha_hash,
      cargo: "Funcionario",
      nivel_acesso: "Funcionario_Comum",
      status: "Inativo",
    });

    await registrarAuditoria( novoUsuario.id_usuario,"CADASTRO",`Usuário "${nome_completo}" fez o cadastro e aguarda autorização do administrador.`);

    res.status(201).json({
      message: "Cadastro realizado com sucesso! Aguarde a autorização do administrador.",
    });

  } catch (err) {
    console.error("erro no RegistroController:", err);
    res.status(500).json({ error: err.message });
  }
};
