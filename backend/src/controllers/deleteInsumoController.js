import * as InsumoModel from "../models/InsumoModel.js";

export const deletarInsumo = async (req, res) => {
  const { id } = req.params;
  const produtoId = Number(id);

  try {
    await InsumoModel.deletarInsumo(produtoId);
    res.status(200).json({ mensagem: "Produto e relações deletados com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar insumo:", error);
    res.status(500).json({ mensagem: "Erro ao deletar insumo", error: error.message });
  }
};
