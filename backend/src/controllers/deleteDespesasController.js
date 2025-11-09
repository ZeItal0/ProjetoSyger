import * as DespesaModel from "../models/DespesasModel.js";
import { registrarAuditoria } from "../utils/registrarAuditoria.js";

export const deletarDespesa = async (req, res) => {
  try {
    const { id } = req.params;
    await DespesaModel.deletarDespesa(Number(id));
    await registrarAuditoria (req.usuario.id, "DELETOU", `Usuário "${req.usuario.nome_completo}" Deletou a despesa "${id}".`);
    res.status(200).json({ message: "despesa deletada com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar despesa:", err);
    res.status(500).json({ message: "erro interno ao deletar despesa" });
  }
};