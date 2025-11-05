import { pratoModel } from "../models/PratosModel.js";

export const listarPratos = async (req, res) => {
  try {
    const pratos = await pratoModel.listar();
    res.status(200).json(pratos);
  } catch (err) {
    console.error("Erro ao listar pratos:", err);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar pratos.",
      error: err.message,
    });
  }
};