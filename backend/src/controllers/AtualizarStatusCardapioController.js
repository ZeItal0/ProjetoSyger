import { atualizarStatusPrato, } from "../models/cardapioModel.js";
import { registrarAuditoria } from "../utils/registrarAuditoria.js";

export const atualizarDisponibilidade = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const disponivel = status === "DISPONIVEL";
    const result = await atualizarStatusPrato(id, disponivel);

    if (result.count === 0) {
      return res.status(404).json({ mensagem: "prato não encontrado para atualização" });
    }
    await registrarAuditoria(req.usuario.id, "ATUALIZOU", `Usuário "${req.usuario.nome_completo}" Atualizou a Disponibilidade do produto de ID:${id}" para:${status}.`);
    res.json({ mensagem: `status do prato atualizado para ${status}` });
  } catch (error) {
    console.error("erro ao atualizar disponibilidade:", error);
    res.status(500).json({ mensagem: "erro ao atualizar status do prato." });
  }
};











