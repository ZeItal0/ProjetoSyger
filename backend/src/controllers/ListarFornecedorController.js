import * as FornecedorModel from "../models/FornecedorModel.js";

export const listarFornecedores = async (req, res) => {
  try {
    const fornecedores = await FornecedorModel.listarFornecedores();
    res.json(fornecedores);
  } catch (err) {
    console.error("Erro ao listar fornecedores:", err);
    res.status(500).json({ message: "Erro ao listar fornecedores" });
  }
};
