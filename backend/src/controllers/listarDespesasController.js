import * as DespesaModel from "../models/DespesasModel.js";

export const listarDespesas = async (req, res) => {
  try {
    const despesas = await DespesaModel.listarDespesas();
    return res.status(200).json(despesas);
  } catch (err) {
    console.error("erro ao listar despesas:", err);
    return res.status(500).json({ message: "erro interno ao listar despesas" });
  }
};