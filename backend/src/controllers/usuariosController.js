import { listarUsuarios, pausarUsuario, reativarUsuario, autorizarUsuario, excluirUsuario, listarUsuariosAtivos } from "../models/usuarioModel.js";

export const listarUsuariosController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;

    const resultado = await listarUsuarios(page, limit);
    res.status(200).json(resultado);
  } catch (err) {
    console.error("erro ao listar usuários:", err);
    res.status(500).json({ mensagem: "erro ao listar usuários." });
  }
}; 

export const pausarUsuarioController = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioAtualizado = await pausarUsuario(id);

    res.status(200).json({
      mensagem: "Conta pausada com sucesso.",
      usuario: usuarioAtualizado,
    });
  } catch (error) {
    console.error("Erro ao pausar usuário:", error);
    res.status(500).json({ erro: error.message || "erro interno ao pausar conta." });
  }
};

export const reativarUsuarioController = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await reativarUsuario(parseInt(id));
    res.status(200).json(resultado);
  } catch (err) {
    console.error("erro ao reativar usuário:", err);
    res.status(500).json({ erro: "erro ao reativar usuário." });
  }
};

export const autorizarUsuarioController = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioAtualizado = await autorizarUsuario(id);

    res.status(200).json({
      mensagem: "usuário autorizado com sucesso.",
      usuario: usuarioAtualizado,
    });
  } catch (error) {
    console.error("erro ao autorizar usuário:", error);
    res.status(500).json({ erro: error.message || "erro interno ao autorizar usuário." });
  }
};

export const excluirUsuarioController = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await excluirUsuario(Number(id));

    res.status(200).json({
      mensagem: "usuário excluído (soft delete) com sucesso.",
      usuario: resultado,
    });
  } catch (err) {
    console.error("erro ao excluir usuário:", err);
    res.status(500).json({ erro: err.message || "erro ao excluir usuário." });
  }
};

export const listarUsuariosAtivosController = async (req, res) => {
  try {
    const usuariosAtivos = await listarUsuariosAtivos();
    res.status(200).json(usuariosAtivos);
  } catch (err) {
    console.error("erro ao listar usuários ativos:", err);
    res.status(500).json({ erro: "erro ao listar usuários ativos." });
  }
};