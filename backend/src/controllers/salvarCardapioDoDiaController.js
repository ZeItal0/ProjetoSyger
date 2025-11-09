import { adicionarAoCardapioDoDia, } from "../models/cardapioModel.js";
import { registrarAuditoria } from "../utils/registrarAuditoria.js";

export const postAdicionarAoCardapio = async (req, res) => {
  try {
    const { pratos } = req.body;

    if (!pratos || !Array.isArray(pratos) || pratos.length === 0) {
      return res.status(400).json({ mensagem: "nenhum prato enviado para o cardápio." });
    }
    await registrarAuditoria(req.usuario.id, "CADASTRO", `Usuário "${req.usuario.nome_completo}" Adicionou Variações de pratos ao cardapio.`);
    const resultado = await adicionarAoCardapioDoDia(pratos);
    res.status(201).json({ message: "cardápio salvo com sucesso!", resultado });
  } catch (err) {
    console.error("erro ao adicionar ao cardápio do dia:", err);
    res.status(500).json({ mensagem: err.message });
  }
};