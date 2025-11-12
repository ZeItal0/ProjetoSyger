import { listarMensagensPorUsuario } from "../services/mensagensService.js";


export async function obterMensagens(req, res) {
  const { idUsuario } = req.params;
  try {
    const mensagens = await listarMensagensPorUsuario(idUsuario);
    res.json(mensagens);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar mensagens" });
  }
}
