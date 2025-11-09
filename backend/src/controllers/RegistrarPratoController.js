import { createPrato, findOrCreateCategoriaPrato } from "../models/PratosModel.js";
import { registrarPratoSchema } from "../validations/ingredienteSchema.js";
import { registrarAuditoria } from "../utils/registrarAuditoria.js";

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

    const ingredientesDesc = Array.isArray(ingredientes)
      ? ingredientes.map(i => i.nome || i).join(", ")
      : ingredientes;

    const descricaoAuditoria = `Usuário "${req.usuario.nome_completo}" cadastrou uma nova receita "${nome_prato}" na categoria "${categoria}", com tempo de preparo de ${tempo_preparo} min, custo base de R$${valor_base_custo}, e ingredientes: ${ingredientesDesc}.`;

    await registrarAuditoria(req.usuario.id, "CADASTRO", descricaoAuditoria);

    res.status(201).json(prato);
  } catch (err) {
    console.error("Erro ao registrar prato:", err);
    res.status(500).json({ message: "Erro ao registrar prato.", error: err.message });
  }
};
