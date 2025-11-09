import { listarHistorico } from "../models/auditoriaModel.js";

export const listarHistoricoAuditoria = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const resultado = await listarHistorico(page, limit);
    res.status(200).json(resultado);
  } catch (err) {
    console.error("Erro ao listar histórico:", err);
    res
      .status(500)
      .json({ mensagem: "Erro ao listar registros de histórico." });
  }
};
