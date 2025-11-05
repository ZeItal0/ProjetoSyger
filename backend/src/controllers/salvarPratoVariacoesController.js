import { salvarVariacoesSchema } from "../validations/variacoesSchema.js";
import { pratoModel } from "../models/PratosModel.js";

export const salvarVariacoes = async (req, res) => {
  try {
    const { error } = salvarVariacoesSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const mensagens = error.details.map((d) => d.message);
      return res.status(400).json({ sucesso: false, mensagens });
    }

    const { id_prato, variacoes } = req.body;
    const resultado = await pratoModel.salvarVariacoes(id_prato, variacoes);

    res.status(200).json(resultado);
  } catch (err) {
    console.error("erro ao salvar variações:", err);
    res.status(500).json({
      sucesso: false,
      mensagem: "erro ao salvar variações.",
      error: err.message,
    });
  }
};