import Joi from "joi";

export const variacaoSchema = Joi.object({
  id_variacao: Joi.number().optional(),

  nome_menu: Joi.string()
    .pattern(/^[a-zA-ZÀ-ÿ0-9\s.,'-]+$/)
    .min(2)
    .required()
    .messages({
      "string.base": "O nome da variação deve ser um texto.",
      "string.empty": "O nome da variação é obrigatório.",
      "string.min": "O nome da variação deve ter pelo menos 2 caracteres.",
      "string.pattern.base":
        "O nome da variação não pode conter caracteres especiais (use apenas letras, números e espaços).",
      "any.required": "O nome da variação é obrigatório.",
    }),

  multiplicador_receita: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "O multiplicador deve ser um número.",
      "number.min": "O multiplicador não pode ser negativo.",
      "any.required": "O multiplicador é obrigatório.",
    }),

  preco_venda: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "O preço deve ser um número.",
      "number.min": "O preço não pode ser negativo.",
      "any.required": "O preço é obrigatório.",
    }),
});

export const salvarVariacoesSchema = Joi.object({
  id_prato: Joi.number().required().messages({
    "number.base": "O ID do prato deve ser numérico.",
    "any.required": "O ID do prato é obrigatório.",
  }),

  variacoes: Joi.array()
    .items(variacaoSchema)
    .min(1)
    .required()
    .messages({
      "array.base": "As variações devem ser enviadas em formato de lista.",
      "array.min": "Envie pelo menos uma variação.",
      "any.required": "As variações são obrigatórias.",
    }),
});
