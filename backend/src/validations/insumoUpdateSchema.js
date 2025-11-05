import Joi from "joi";

export const insumoUpdateSchema = Joi.object({
  nomeProduto: Joi.string()
    .pattern(/^[A-Za-zÀ-ú\s]+$/)
    .min(3)
    .messages({
      "string.base": "Nome do produto deve ser um texto",
      "string.min": "Nome do produto deve ter no mínimo 3 caracteres",
      "string.pattern.base": "Nome do produto deve conter apenas letras e espaços",
    }),

  categoria: Joi.string()
    .min(2)
    .messages({
      "string.base": "Categoria deve ser um texto",
      "string.min": "Categoria deve ter no mínimo 2 caracteres",
    }),

  unidadeCompra: Joi.string()
    .valid("fardo", "unidade", "caixa")
    .messages({
      "any.only": "Unidade de compra inválida",
    }),

  quantidadeMinima: Joi.number()
    .positive()
    .messages({
      "number.base": "Quantidade mínima deve ser um número",
      "number.positive": "Quantidade mínima deve ser maior que zero",
    }),
  quantidadeMaxima: Joi.number()
    .positive()
    .messages({
      "number.base": "Quantidade máxima deve ser um número",
      "number.positive": "Quantidade máxima deve ser maior que zero",
    }),

  validade: Joi.date()
    .greater('now')
    .messages({
      "date.base": "Validade deve ser uma data válida",
      "date.greater": "Validade deve ser uma data futura",
    }),

  unidadeMedida: Joi.string()
    .valid("gramas", "mililitros")
    .messages({
      "any.only": "Unidade de medida inválida",
    }),

  quantidadeAtual: Joi.number()
    .positive()
    .messages({
      "number.base": "Quantidade atual deve ser um número",
      "number.positive": "Quantidade atual deve ser maior que zero",
    }),
}).unknown(true);
