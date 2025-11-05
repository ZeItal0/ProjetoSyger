import Joi from "joi";

export const adicionarItemSchema = Joi.object({
  id_prato: Joi.number().integer().positive().required().messages({
    "number.base": "ID do prato deve ser numérico.",
    "any.required": "ID do prato é obrigatório.",
  }),
  id_variacao: Joi.number().integer().positive().optional(),
});

export const removerItemSchema = Joi.object({
  id_prato: Joi.number().integer().positive().optional(),
  id_cardapio_prato: Joi.number().integer().positive().optional(),
}).or("id_prato", "id_cardapio_prato").messages({
  "object.missing": "Envie id_prato ou id_cardapio_prato para remover.",
});
