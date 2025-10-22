import Joi from "joi";

export const registerSchema = Joi.object({
  nome_completo: Joi.string()
    .min(3).required().messages({
      "string.base": "nome deve ser um texto",
      "string.empty": "nome e obrigatorio",
      "string.min": "nome deve ter no minimo 3 caracteres",
      "any.required": "nome e obrigatorio",
    }),

  email: Joi.string()
    .email().required().messages({
      "string.email": "email invalido",
      "string.empty": "email e obrigatorio",
      "any.required": "email e obrigatorio",
    }),

  usuario: Joi.string()
    .min(3).required().messages({
      "string.empty": "usuario e obrigatório",
      "string.min": "usuario deve ter no minimo 3 caracteres",
      "any.required": "usuario e obrigatório",
    }),

  cnpj: Joi.string()
    .pattern(/^\d{14}$/).required().messages({
      "string.pattern.base": "CNPJ deve ter 14 numeros",
      "string.empty": "CNPJ e obrigatorio",
      "any.required": "CNPJ e obrigatorio",
    }),

  senha: Joi.string()
    .min(6).required().messages({
      "string.empty": "senha e obrigatoria",
      "string.min": "senha deve ter no minimo 6 caracteres",
      "any.required": "senha e obrigatoria",
    }),
});

export const loginSchema = Joi.object({
  usuario: Joi.string().min(3).required().messages({
      "string.empty": "usuario e obrigatório",
      "string.min": "usuario invalido",
      "any.required": "usuario e obrigatório",
    }),

  senha: Joi.string().min(6).required().messages({
      "string.empty": "senha e obrigatoria",
      "string.min": "senha invalida",
      "any.required": "senha e obrigatoria",
    }),
});
