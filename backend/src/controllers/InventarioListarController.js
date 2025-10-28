import * as InsumoModel from "../models/InsumoModel.js";

export const listarInsumos = async (req, res) => {
  try {
    const insumos = await InsumoModel.listarInsumos();
    res.status(200).json(insumos);
  } catch (error) {
    console.error("Erro ao listar insumos:", error);
    res.status(500).json({ mensagem: "Erro ao listar insumos" });
  }
};
