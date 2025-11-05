import { createPrato, findOrCreateCategoriaPrato } from "../models/PratosModel.js";
import { registrarPratoSchema } from "../validations/ingredienteSchema.js";

export const registrarPrato = async (req, res) => {
  try {
    const { value, error } = registrarPratoSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.details.map(d => d.message) });
    }

    const { nome_prato, categoria, tempo_preparo, valor_base_custo, descricao, ingredientes } = value;

    const categoriaObj = await findOrCreateCategoriaPrato(categoria);

    const prato = await createPrato({
      nome_prato,
      id_categoria_prato: categoriaObj.id_categoria_prato,
      tempo_preparo: Number(tempo_preparo),
      valor_base_custo: Number(valor_base_custo),
      descricao,
      ingredientes,
    });
    res.status(201).json(prato);
  } catch (err) {
    console.error("erro ao registrar prato:", err);
    res.status(500).json({ message: "erro ao registrar prato.", error: err.message });
  }
};
