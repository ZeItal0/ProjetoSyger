import * as MesaModel from "../models/mesasModel.js";

export const criarMesa = async (req, res) => {
  try {
    const mesa = await MesaModel.criarMesaModel(req.body);
    return res.status(201).json(mesa);
  } catch (error) {
    console.error("erro ao criar mesa:", error);
    return res.status(500).json({ erro: error.message || "erro ao criar mesa" });
  }
};

export const listarMesasAbertas = async (req, res) => {
  try {
    const mesas = await MesaModel.listarMesasAbertasModel();
    return res.json(mesas);
  } catch (error) {
    console.error("Erro ao listar mesas:", error);
    return res.status(500).json({ erro: "Erro ao listar mesas" });
  }
};

export const adicionarItemMesa = async (req, res) => {
  try {
    const item = await MesaModel.adicionarItemMesaModel({ id_mesa: req.params.id_mesa, ...req.body });
    return res.json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "erro ao adicionar item a mesa" });
  }
};

export const removerItemMesa = async (req, res) => {
  try {
    await MesaModel.removerItemMesaModel(req.params.id_item_pedido);
    return res.json({ sucesso: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "erro ao remover item da mesa" });
  }
};

export const finalizarMesa = async (req, res) => {
  try {
    const pedido = await MesaModel.finalizarMesaModel({
      id_mesa: req.params.id_mesa,
      forma_pagamento: req.body.forma_pagamento,
      id_usuario: req.usuario.id || null,
    });
    return res.status(200).json({ sucesso: true, pedido });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: err.message || "erro ao finalizar mesa" });
  }
};
