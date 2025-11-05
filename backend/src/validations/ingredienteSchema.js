import Joi from "joi";

const ingredienteSchema = Joi.object({
  id_produto: Joi.number().integer().required()
    .messages({
      "number.base": "ID do produto deve ser um número",
      "any.required": "ID do produto é obrigatório",
    }),
  quantidade: Joi.number().positive().required()
    .messages({
      "number.base": "Quantidade deve ser um número",
      "number.positive": "Quantidade deve ser maior que 0",
      "any.required": "Quantidade é obrigatória",
    }),
  id_unidade_medida: Joi.number().integer().required()
    .messages({
      "number.base": "ID da unidade de medida deve ser um número",
      "any.required": "ID da unidade de medida é obrigatório",
    }),
  valor_medida: Joi.number().positive().required()
    .messages({
      "number.base": "Valor da medida deve ser um número",
      "number.positive": "Valor da medida deve ser maior que 0",
      "any.required": "Valor da medida é obrigatório",
    }),
});

export const registrarPratoSchema = Joi.object({
 nome_prato: Joi.string().pattern(/[A-Za-zÀ-ÿ]/).min(3).required().messages({
    "string.base": "Nome do prato deve ser texto",
    "string.empty": "Nome do prato é obrigatório",
    "string.min": "Nome do prato deve ter ao menos 3 caracteres",
    "string.pattern.base": "Nome do prato deve conter pelo menos uma letra",
    "any.required": "Nome do prato é obrigatório",
  }),

  categoria: Joi.string().required()
    .messages({
      "string.base": "Categoria deve ser texto",
      "string.empty": "Categoria é obrigatória",
      "any.required": "Categoria é obrigatória",
    }),
  tempo_preparo: Joi.number().integer().min(1).required()
    .messages({
      "number.base": "Tempo de preparo deve ser um número",
      "number.min": "Tempo de preparo deve ser pelo menos 1 minuto",
      "any.required": "Tempo de preparo é obrigatório",
    }),
  valor_base_custo: Joi.number().positive().required()
    .messages({
      "number.base": "Valor do prato deve ser um número",
      "number.positive": "Valor do prato deve ser maior que 0",
      "any.required": "Valor do prato é obrigatório",
    }),
  descricao: Joi.string().allow("", null),
  ingredientes: Joi.array().items(ingredienteSchema).min(1)
    .required()
    .messages({
      "array.base": "Ingredientes devem ser uma lista",
      "array.min": "Deve haver pelo menos 1 ingrediente",
      "any.required": "Ingredientes são obrigatórios",
    }),
});
