import * as MarmitaModel from "../models/marmitasModel.js";

export const criarMarmita = async (req, res) => {
  try {
    const marmita = await MarmitaModel.criarMarmitaModel(req.body);
    return res.status(201).json(marmita);
  } catch (err) {
    console.error("Erro ao criar marmita:", err);
    return res.status(500).json({ erro: err.message || "Erro ao criar marmita" });
  }
};

export const listarMarmitas = async (req, res) => {
  try {
    const marmitas = await MarmitaModel.listarMarmitasModel();
    return res.json(marmitas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro ao listar marmitas" });
  }
};

export const adicionarItemMarmita = async (req, res) => {
  try {
    const item = await MarmitaModel.adicionarItemMarmitaModel({ id_marmita: req.params.id_marmita, ...req.body });
    return res.json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro ao adicionar item à marmita" });
  }
};

export const removerItemMarmita = async (req, res) => {
  try {
    await MarmitaModel.removerItemMarmitaModel(req.params.id_item_pedido);
    return res.json({ sucesso: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro ao remover item da marmita" });
  }
};

export const finalizarMarmita = async (req, res) => {
  try {
    const pedido = await MarmitaModel.finalizarMarmitaModel({
      id_marmita: req.params.id_marmita,
      forma_pagamento: req.body.forma_pagamento,
      id_usuario: req.usuario.id || null,
    });
    return res.status(200).json({ sucesso: true, pedido });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: err.message || "Erro ao finalizar marmita" });
  }
};
