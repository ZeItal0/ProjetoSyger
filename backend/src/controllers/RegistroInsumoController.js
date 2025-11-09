import { insumoSchema } from "../validations/insumoSchema.js";
import * as InsumoModel from "../models/InsumoModel.js";
import { registrarAuditoria } from "../utils/registrarAuditoria.js";

export const cadastrarInsumo = async (req, res) => {
  const { nomeProduto, categoria, unidadeCompra, quantidadeMinima, quantidadeMaxima, validade, unidadeMedida, valorTotal, quantidade, fornecedorSelecionado, id_usuario } = req.body;

  try {
    const { error } = insumoSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: error.details.map(d => d.message) });

    const categoriaExistente = await InsumoModel.findOrCreateCategoria(categoria);
    const unidadeExistente = await InsumoModel.findOrCreateUnidade(unidadeMedida);

    const novoProduto = await InsumoModel.createProduto({
      nome_produto: nomeProduto,
      id_categoria_produto: categoriaExistente.id_categoria_produto,
      id_unidade_medida: unidadeExistente.id_unidade_medida,
      validade: validade ? new Date(validade) : null,
      quantidade_minima: parseFloat(quantidadeMinima),
      quantidade_maxima: quantidadeMaxima ? parseFloat(quantidadeMaxima) : null,
      quantidade_atual: parseFloat(quantidade),
      forma_compra: unidadeCompra,
      custo_unitario: parseFloat(valorTotal) / (quantidade || 1),
    });

    await InsumoModel.vincularFornecedorProduto(fornecedorSelecionado, novoProduto.id_produto);

    await InsumoModel.registrarMovimentacao({
      id_produto: novoProduto.id_produto,
      tipo_movimentacao: "Entrada",
      quantidade: parseFloat(quantidade),
      id_unidade_medida: unidadeExistente.id_unidade_medida,
      id_usuario: id_usuario || null,
      observacoes: `Entrada inicial de ${quantidade} ${unidadeMedida}(s) para o produto ${nomeProduto}`,
    });

    await registrarAuditoria( req.usuario.id, "CADASTRO", `Usuário "${req.usuario.nome_completo}" cadastrou o insumo "${nomeProduto}" com ${quantidade} ${unidadeMedida}(s) na categoria "${categoria}".`);
    
    res.status(201).json({ mensagem: "Insumo cadastrado com sucesso!", produto: novoProduto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao cadastrar insumo" });
  }
};
