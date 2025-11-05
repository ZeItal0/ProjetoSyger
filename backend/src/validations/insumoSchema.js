import Joi from "joi";

export const insumoSchema = Joi.object({
  nomeProduto: Joi.string()
    .pattern(/^[A-Za-zÀ-ú\s]+$/)
    .min(3)
    .required()
    .messages({
      "string.base": "Nome do produto deve ser um texto",
      "string.empty": "Nome do produto é obrigatório",
      "string.min": "Nome do produto deve ter no mínimo 3 caracteres",
      "string.pattern.base": "Nome do produto deve conter apenas letras e espaços",
      "any.required": "Nome do produto é obrigatório",
    }),


  categoria: Joi.string()
    .min(2)
    .required()
    .messages({
      "string.base": "Categoria deve ser um texto",
      "string.empty": "Categoria é obrigatória",
      "string.min": "Categoria deve ter no mínimo 2 caracteres",
      "any.required": "Categoria é obrigatória",
    }),

  unidadeCompra: Joi.string()
    .valid("fardo", "unidade", "caixa")
    .required()
    .messages({
      "any.only": "Unidade de compra inválida",
      "any.required": "Unidade de compra é obrigatória",
      "string.empty": "Unidade de compra é obrigatória",
    }),

  quantidadeMinima: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Quantidade mínima deve ser um número",
      "number.positive": "Quantidade mínima deve ser maior que zero",
      "any.required": "Quantidade mínima é obrigatória",
    }),
  quantidadeMaxima: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Quantidade maxima deve ser um número",
      "number.positive": "Quantidade maxima deve ser maior que zero",
      "any.required": "Quantidade maxima é obrigatória",
    }),

  validade: Joi.date()
    .greater('now')
    .required()
    .messages({
      "date.base": "Validade deve ser uma data válida",
      "date.greater": "Validade deve ser uma data futura",
      "any.required": "Validade é obrigatória",
    }),


  unidadeMedida: Joi.string()
    .valid("gramas", "mililitros")
    .required()
    .messages({
      "any.only": "Unidade de medida inválida",
      "any.required": "Unidade de medida é obrigatória",
      "string.empty": "Unidade de medida é obrigatória",
    }),

  valorTotal: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Valor total deve ser um número",
      "number.positive": "Valor total deve ser maior que zero",
      "any.required": "Valor total é obrigatório",
    }),

  quantidade: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Quantidade deve ser um número",
      "number.positive": "Quantidade deve ser maior que zero",
      "any.required": "Quantidade é obrigatória",
    }),

  fornecedorSelecionado: Joi.number()
    .required()
    .messages({
      "number.base": "Fornecedor inválido",
      "any.required": "Fornecedor é obrigatório",
    }),

  id_usuario: Joi.number()
    .optional()
    .messages({
      "number.base": "ID do usuário inválido",
    }),
});
