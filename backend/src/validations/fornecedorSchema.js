import Joi from "joi";

export const fornecedorSchema = Joi.object({
  nome_empresa: Joi.string()
    .min(3)
    .required()
    .messages({
      "string.base": "Nome da empresa deve ser um texto",
      "string.empty": "Nome da empresa é obrigatório",
      "string.min": "Nome da empresa deve ter no mínimo 3 caracteres",
      "any.required": "Nome da empresa é obrigatório",
    }),

  cnpj: Joi.string()
    .pattern(/^\d{14}$/)
    .required()
    .messages({
      "string.pattern.base": "CNPJ deve ter 14 números",
      "string.empty": "CNPJ é obrigatório",
      "any.required": "CNPJ é obrigatório",
    }),

  nome_contato: Joi.string()
    .min(3)
    .required()
    .messages({
      "string.base": "Nome do contato deve ser um texto",
      "string.empty": "Nome do contato é obrigatório",
      "string.min": "Nome do contato deve ter no mínimo 3 caracteres",
      "any.required": "Nome do contato é obrigatório",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Email inválido",
      "string.empty": "Email é obrigatório",
      "any.required": "Email é obrigatório",
    }),

  telefone: Joi.string()
    .pattern(/^\d{10,11}$/)
    .messages({
      "string.pattern.base": "Telefone deve ter 10 ou 11 números",
    }),

  inscricao_estadual: Joi.string()
    .allow("", null)
    .messages({
      "string.base": "Inscrição estadual deve ser texto",
    }),

  cep: Joi.string()
    .pattern(/^\d{8}$/)
    .messages({
      "string.pattern.base": "CEP deve ter 8 números",
    }),

  rua: Joi.string().allow("", null),
  numero: Joi.string().allow("", null),
  bairro: Joi.string().allow("", null),
  observacoes: Joi.string().allow("", null),
});
