import * as DespesaModel from "../models/DespesasModel.js";

export const deletarDespesa = async (req, res) => {
  try {
    const { id } = req.params;
    await DespesaModel.deletarDespesa(Number(id));
    res.status(200).json({ message: "despesa deletada com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar despesa:", err);
    res.status(500).json({ message: "erro interno ao deletar despesa" });
  }
};