import { insumoUpdateSchema } from "../validations/insumoUpdateSchema.js";
import * as InsumoModel from "../models/InsumoModel.js";
import { registrarAuditoria } from "../utils/registrarAuditoria.js";

export const atualizarInsumo = async (req, res) => {
  const { id } = req.params;

  try {
    const { error, value } = insumoUpdateSchema.validate(req.body, { abortEarly: false });
    if (error)
      return res.status(400).json({ message: error.details.map((d) => d.message) });

    const produtoAntigo = await InsumoModel.buscarPorId(id);
    if (!produtoAntigo) return res.status(404).json({ message: "Produto não encontrado" });

    const categoriaId = value.categoria
      ? (await InsumoModel.findCategoriaByNome(value.categoria))?.id_categoria_produto
      : undefined;

    const unidadeId = value.unidadeMedida
      ? (await InsumoModel.findUnidadeByNome(value.unidadeMedida))?.id_unidade_medida
      : undefined;

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

    const alteracoes = Object.entries(dadosAtualizados)
      .map(([campo, novoValor]) => {
        const antigo = produtoAntigo[campo];
        if (antigo === undefined || antigo === novoValor) return null;
        return `${campo}: ${antigo ?? "N/A"} → ${novoValor}`;
      })
      .filter(Boolean)
      .join(", ");

    const descricao = alteracoes
      ? `Usuário "${req.usuario.nome_completo}" atualizou o insumo "${produtoAntigo.nome_produto}" (ID ${id}). Alterações: ${alteracoes}.`
      : `Usuário "${req.usuario.nome_completo}" atualizou o insumo "${produtoAntigo.nome_produto}" (ID ${id}) sem mudanças detectadas.`;

    await registrarAuditoria(req.usuario.id, "ATUALIZOU", descricao);

    res.status(200).json(produtoAtualizado);
  } catch (err) {
    console.error("erro ao atualizar insumo:", err);
    res.status(500).json({ message: "erro ao atualizar insumo", error: err.message });
  }
};