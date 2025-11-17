import { listarVendasRapidasModel, estornarVendaRapidaModel } from "../models/estornoModels.js";

export const listarVendasRapidas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const resultado = await listarVendasRapidasModel({ page, limit });
    return res.json(resultado);
  } catch (err) {
    console.error("erro ao listar vendas rapidas:", err);
    return res.status(500).json({ erro: "erro ao listar vendas rápidas" });
  }
};

export const estornarVendaRapida = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const id_usuario_estornando = req.user?.id_usuario;
    const resultado = await estornarVendaRapidaModel({ id_pedido, id_usuario_estornando });
    return res.json(resultado);
  } catch (err) {
    console.error("erro ao estornar venda rápida:", err);
    return res.status(500).json({ erro: err.message || "erro ao estornar venda rapida" });
  }
};
