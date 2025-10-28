import { insumoUpdateSchema } from "../validations/insumoUpdateSchema.js";
import * as InsumoModel from "../models/InsumoModel.js";

export const atualizarInsumo = async (req, res) => {
  const { id } = req.params;

  try {
    const { error, value } = insumoUpdateSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: error.details.map(d => d.message) });

    const categoriaId = value.categoria
      ? (await InsumoModel.findCategoriaByNome(value.categoria))?.id_categoria_produto
      : undefined;

    if (value.categoria && !categoriaId)
      return res.status(400).json({ message: `Categoria "${value.categoria}" não encontrada` });

    const unidadeId = value.unidadeMedida
      ? (await InsumoModel.findUnidadeByNome(value.unidadeMedida))?.id_unidade_medida
      : undefined;

    if (value.unidadeMedida && !unidadeId)
      return res.status(400).json({ message: `Unidade "${value.unidadeMedida}" não encontrada` });

    const dadosAtualizados = {
      ...(value.nomeProduto && { nome_produto: value.nomeProduto }),
      ...(value.quantidadeMinima && { quantidade_minima: Number(value.quantidadeMinima) }),
      ...(value.quantidadeMaxima && { quantidade_maxima: Number(value.quantidadeMaxima) }),
      ...(categoriaId && { id_categoria_produto: categoriaId }),
      ...(value.unidadeCompra && { forma_compra: value.unidadeCompra }),
      ...(value.validade && { validade: new Date(value.validade) }),
      ...(unidadeId && { id_unidade_medida: unidadeId }),
      ...(value.quantidadeAtual && { quantidade_atual: Number(value.quantidadeAtual) }),
    };

    const produtoAtualizado = await InsumoModel.atualizarProduto(id, dadosAtualizados);

    res.status(200).json(produtoAtualizado);
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar insumo", error: err.message });
  }
};
