import Joi from "joi";

export const schemaCriarMesa = Joi.object({
    numero_mesa: Joi.string()
        .trim()
        .min(1)
        .max(5)
        .required()
        .messages({
            "string.base": "O número da mesa deve ser um texto.",
            "string.empty": "O número da mesa não pode estar vazio.",
            "string.min": "O número da mesa deve ter pelo menos 1 caractere.",
            "string.max": "O número da mesa pode ter no máximo 5 caracteres.",
            "any.required": "O campo número da mesa é obrigatório.",
        }),

    capacidade: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
            "number.base": "A capacidade deve ser um número.",
            "number.integer": "A capacidade deve ser um número inteiro.",
            "number.min": "A capacidade mínima é 0.",
        }),

});
