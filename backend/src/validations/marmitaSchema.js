import Joi from "joi";

export const schemaCriarMarmita = Joi.object({
  numero_marmita: Joi.string()
    .min(1)
    .max(10)
    .pattern(/^[a-zA-Z0-9]+$/)
    .required()
    .messages({
      "string.base": "O número da marmita deve ser um texto.",
      "string.empty": "O número da marmita não pode estar vazio.",
      "string.max": "O número da marmita deve ter no máximo 10 caracteres.",
      "string.pattern.base": "O número da marmita não pode conter caracteres especiais.",
      "any.required": "O número da marmita é obrigatório.",
    }),
});
