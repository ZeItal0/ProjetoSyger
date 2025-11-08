import * as DespesaModel from "../models/DespesasModel.js";

export const atualizarDespesa = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_divida, data_pagamento } = req.body;

    const despesa = await DespesaModel.atualizarDespesa(Number(id), {
      status_divida,
      data_pagamento: data_pagamento ? new Date(data_pagamento) : null,
    });

    res.status(200).json(despesa);
  } catch (err) {
    console.error("erro ao atualizar despesa:", err);
    res.status(500).json({ message: "erro interno ao atualizar despesa" });
  }
};