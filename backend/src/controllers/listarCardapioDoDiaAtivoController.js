import { buscarCardapioAtivo, buscarPratosDoCardapio, } from "../models/cardapioModel.js";

export const listarCardapioDoDiaAtivo = async (req, res) => {
  try {
    const cardapioAtivo = await buscarCardapioAtivo();

    if (!cardapioAtivo) {
      return res.status(404).json({ message: "nenhum cardápio ativo encontrado." });
    }

    const pratosCardapio = await buscarPratosDoCardapio(cardapioAtivo.id_cardapio);

    const resultado = pratosCardapio.map((item) => ({
      id_cardapio_prato: item.id_cardapio_prato,
      nome_prato: item.prato.nome_prato,
      categoria: item.prato.categoria?.nome_categoria || "Sem categoria",
      variacao: item.variacao ? item.variacao.nome_menu : null,
      preco: item.variacao
        ? parseFloat(item.variacao.preco_venda)
        : parseFloat(item.prato.valor_base_custo || 0),
      status: item.disponivel ? "DISPONIVEL" : "ESGOTADO",
    }));

    res.json({ cardapio: cardapioAtivo.nome, pratos: resultado });
  } catch (error) {
    console.error("erro ao listar cardápio do dia:", error);
    res.status(500).json({ message: "erro ao listar cardápio do dia." });
  }
};