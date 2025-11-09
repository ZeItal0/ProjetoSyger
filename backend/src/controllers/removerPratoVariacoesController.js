import { pratoModel } from "../models/PratosModel.js";
import { registrarAuditoria } from "../utils/registrarAuditoria.js";

export const removerVariacao = async (req, res) => {
  try {
    const { id_variacao } = req.params;
    const resultado = await pratoModel.removerVariacao(id_variacao);
    await registrarAuditoria(req.usuario.id, "DELETOU", `Usuário "${req.usuario.nome_completo}" Deletou uma Variacao do prato id "${id_variacao}".`);
    res.status(200).json(resultado);
  } catch (err) {
    console.error("erro ao remover variação:", err);
    res.status(500).json({
      sucesso: false,
      mensagem: err.message || "erro ao remover variação.",
    });
  }
};
