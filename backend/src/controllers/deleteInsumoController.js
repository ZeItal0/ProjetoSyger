import * as InsumoModel from "../models/InsumoModel.js";
import { registrarAuditoria } from "../utils/registrarAuditoria.js";

export const deletarInsumo = async (req, res) => {
  const { id } = req.params;
  const produtoId = Number(id);
  try {
    const insumo = await InsumoModel.buscarPorId(produtoId);
    if (!insumo) {
      return res.status(404).json({ mensagem: `Insumo com ID ${id} não encontrado.` });
    }
    await InsumoModel.deletarInsumo(produtoId);
    const descricao = `Usuário "${req.usuario.nome_completo}" deletou o insumo "${insumo.nome_produto}" (ID: ${insumo.id_produto}), categoria "${insumo.categoria?.nome_categoria ?? 'Não definida'}", unidade "${insumo.unidade?.nome_unidade ?? 'Não definida'}".`;
    await registrarAuditoria(req.usuario.id, "DELETOU", descricao);

    res.status(200).json({ mensagem: "produto e relações deletados com sucesso!" });
  } catch (error) {
    console.error("erro ao deletar insumo:", error);
    res.status(500).json({ mensagem: "erro ao deletar insumo", error: error.message });
  }
};
