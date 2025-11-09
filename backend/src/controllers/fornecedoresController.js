import { fornecedorSchema } from "../validations/fornecedorSchema.js";
import * as FornecedorModel from "../models/FornecedorModel.js";
import { registrarAuditoria } from "../utils/registrarAuditoria.js";

export const criarFornecedor = async (req, res) => {
  const { nome_empresa, cnpj, nome_contato, email, telefone, inscricao_estadual, cep, rua, numero, bairro, observacoes } = req.body;

  try {
    const { error } = fornecedorSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: error.details.map(d => d.message) });

    const fornecedorExistente = await FornecedorModel.findByCNPJ(cnpj);
    if (fornecedorExistente) return res.status(409).json({ message: "Fornecedor já cadastrado" });

    const novoFornecedor = await FornecedorModel.createFornecedor({
      nome_empresa,
      cnpj,
      nome_contato,
      email,
      telefone,
      inscricao_estadual,
      cep,
      rua,
      numero,
      bairro,
      observacoes,
    });
    
    await registrarAuditoria (req.usuario.id, "CADASTRO", `Usuário "${req.usuario.nome_completo}" cadastrou o fornecedor "${nome_empresa}.`)

    return res.status(201).json({ message: "fornecedor registrado com sucesso", fornecedor: novoFornecedor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "erro ao criar fornecedor" });
  }
};
