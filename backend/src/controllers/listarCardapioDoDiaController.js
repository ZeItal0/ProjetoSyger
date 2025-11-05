import { listarCardapioDoDia, } from "../models/cardapioModel.js";

export const getCardapioDoDia = async (req, res) => {
  try {
    const cardapio = await listarCardapioDoDia();
    res.status(200).json(cardapio);
  } catch (err) {
    console.error("erro ao listar cardápio do dia:", err);
    res.status(500).json({ mensagem: "erro ao listar cardápio do dia.", erro: err.message });
  }
};