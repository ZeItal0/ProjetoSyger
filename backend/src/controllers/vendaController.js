import { criarPedido } from "../models/vendaModel.js";

export const finalizarVenda = async (req, res) => {
    try {
        const { tipo_venda, forma_pagamento, itens } = req.body;
        const id_usuario = req.user?.id_usuario || null;

        const pedido = await criarPedido({ tipo_venda, forma_pagamento, itens, id_usuario });

        return res.status(201).json({ sucesso: true, pedido });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Erro ao finalizar venda" });
    }
};
