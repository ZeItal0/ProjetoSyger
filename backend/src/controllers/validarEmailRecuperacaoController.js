import { buscarUsuarioPorEmail } from "../models/usuarioModel.js";

export const validarEmailRecuperacao = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email é obrigatório!" });

    const usuario = await buscarUsuarioPorEmail(email);

    if (!usuario)
      return res.status(404).json({ message: "Email não encontrado!" });

    return res.status(200).json({ message: "Email válido." });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};
