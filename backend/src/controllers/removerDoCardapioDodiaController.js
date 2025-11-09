import { buscarPratoPorId, removerPrato, } from "../models/cardapioModel.js";
import { registrarAuditoria } from "../utils/registrarAuditoria.js";

export const removerDoCardapio = async (req, res) => {
  const { id } = req.params;

  try {
    const prato = await buscarPratoPorId(id);
    if (!prato) {
      return res.status(404).json({ mensagem: "prato não encontrado no cardápio" });
    }
    await registrarAuditoria(req.usuario.id, "DELETOU", `Usuário "${req.usuario.nome_completo}" Deletou uma variação de prato do Cardapio, id da Variação: ${id}.`);
    await removerPrato(id);
    res.json({ mensagem: "prato removido com sucesso" });
  } catch (error) {
    console.error("erro ao remover prato:", error);
    res.status(500).json({ mensagem: "erro ao remover prato do cardápio" });
  }
};