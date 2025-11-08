import Joi from "joi";

export const DespesaSchema = Joi.object({
  descricao: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,'-]+$/)
    .required()
    .messages({
      "string.base": "A descrição deve ser um texto.",
      "string.empty": "A descrição é obrigatória.",
      "string.min": "A descrição deve ter pelo menos 3 caracteres.",
      "string.max": "A descrição pode ter no máximo 100 caracteres.",
      "string.pattern.base":
        "A descrição não pode conter caracteres especiais inválidos.",
      "any.required": "A descrição é obrigatória.",
    }),

  valor_original: Joi.number().positive().required().messages({
    "number.base": "O valor deve ser numérico.",
    "number.positive": "O valor deve ser maior que zero.",
    "any.required": "O valor é obrigatório.",
  }),

  data_vencimento: Joi.date().iso().required().messages({
    "date.base": "A data de vencimento deve ser uma data válida.",
    "date.format": "Use o formato ISO (AAAA-MM-DD).",
    "any.required": "A data de vencimento é obrigatória.",
  }),

  data_pagamento: Joi.date().iso().allow(null, "").messages({
    "date.base": "A data de pagamento deve ser uma data válida.",
  }),

  status_divida: Joi.string()
    .valid("A pagar", "Pago", "VENCIDA", "Cancelado/Estornado")
    .required()
    .messages({
      "any.only":
        "O status deve ser um dos seguintes: Pendente, Pago, Atrasado ou Cancelado.",
      "any.required": "O status é obrigatório.",
    }),

  categoria: Joi.string().min(2).required().messages({
    "string.base": "A categoria deve ser um texto.",
    "string.empty": "A categoria é obrigatória.",
    "string.min": "A categoria deve ter pelo menos 2 caracteres.",
    "any.required": "A categoria é obrigatória.",
  }),

  fornecedorId: Joi.number().integer().positive().required().messages({
    "number.base": "O ID do fornecedor deve ser numérico.",
    "number.integer": "O ID do fornecedor deve ser um número inteiro.",
    "number.positive": "O ID do fornecedor deve ser positivo.",
    "any.required": "O ID do fornecedor é obrigatório.",
  }),
});
