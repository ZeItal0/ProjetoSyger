import Joi from "joi";

export const redefinirSenhaSchema = Joi.object({
  token: Joi.string()
    .uuid({ version: "uuidv4" })
    .required()
    .messages({
      "string.base": "O token deve ser um texto.",
      "string.empty": "O token é obrigatório.",
      "string.guid": "O token enviado é inválido.",
      "any.required": "O token é obrigatório.",
    }),

  novaSenha: Joi.string()
    .min(6)
    .max(20)
    .pattern(/[A-Z]/, "uma letra maiúscula")
    .pattern(/[a-z]/, "uma letra minúscula")
    .pattern(/[0-9]/, "um número")
    .pattern(/[!@#$%^&*]/, "um caractere especial")
    .required()
    .messages({
      "string.base": "A senha deve ser um texto.",
      "string.empty": "A senha é obrigatória.",
      "string.min": "A senha deve ter pelo menos 6 caracteres.",
      "string.max": "A senha não pode ter mais de 20 caracteres.",
      "string.pattern.name":
        "A senha deve conter pelo menos {#name}.",
      "any.required": "A senha é obrigatória.",
    }),
});

export const validarCodigoSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.base": "O email deve ser um texto.",
      "string.email": "Email inválido.",
      "string.empty": "O email é obrigatório.",
      "any.required": "O email é obrigatório.",
    }),

  codigo: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.base": "O código deve ser um texto numérico.",
      "string.empty": "O código é obrigatório.",
      "string.length": "O código deve ter exatamente 6 dígitos.",
      "string.pattern.base": "O código deve conter apenas números.",
      "any.required": "O código é obrigatório.",
    }),
});

export const validarEmailSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.base": "O email deve ser um texto.",
      "string.email": "Email inválido.",
      "string.empty": "O email é obrigatório.",
      "any.required": "O email é obrigatório.",
    }),
});