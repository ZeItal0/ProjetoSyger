import * as DespesaModel from "../models/DespesasModel.js";
import * as CategoriaModel from "../models/categoriasModel.js";
import { DespesaSchema } from "../validations/DespesaSchema.js";

export const criarDespesa = async (req, res) => {
  try {
    const { error, value } = DespesaSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const mensagens = error.details.map((d) => d.message);
      return res.status(400).json({ message: "Erro de validação", erros: mensagens });
    }

    const usuarioId = req.usuario?.id_usuario || req.usuario?.id;

    const {
      descricao,
      valor_original,
      data_vencimento,
      status_divida,
      categoria,
      data_pagamento,
      fornecedorId,
    } = value;

    let categoriaRecord = await CategoriaModel.findByName(categoria);
    if (!categoriaRecord) {
      categoriaRecord = await CategoriaModel.createCategoria(categoria);
    }

    const novaDespesa = await DespesaModel.criarDespesa({
      descricao,
      valor_original,
      data_vencimento: new Date(data_vencimento),
      status_divida,
      data_pagamento: data_pagamento ? new Date(data_pagamento) : null,
      fornecedorId,
      categoriaId: categoriaRecord.id_categoria_financeira,
      usuarioId,
    });

    return res.status(201).json(novaDespesa);
  } catch (err) {
    console.error("Erro ao criar despesa:", err);
    return res.status(500).json({ message: "erro interno ao criar despesa" });
  }
};
