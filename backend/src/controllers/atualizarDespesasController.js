import * as DespesaModel from "../models/DespesasModel.js";
import { registrarAuditoria } from "../utils/registrarAuditoria.js";

export const atualizarDespesa = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_divida, data_pagamento } = req.body;

    const despesa = await DespesaModel.atualizarDespesa(Number(id), {
      status_divida,
      data_pagamento: data_pagamento ? new Date(data_pagamento) : null,
    });
     await registrarAuditoria(req.usuario.id, "ATUALIZOU", `Usuário "${req.usuario.nome_completo}" Atualizou a despesa de ID:${id} para o Status: ${status_divida}.`);
    res.status(200).json(despesa);
  } catch (err) {
    console.error("erro ao atualizar despesa:", err);
    res.status(500).json({ message: "erro interno ao atualizar despesa" });
  }
};