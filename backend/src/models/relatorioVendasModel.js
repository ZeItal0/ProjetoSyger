import prisma from "../prismaCliente.js";
import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

const toBrazilTime = (date) => new Date(date.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));

export const brStartOfDay = (date) => startOfDay(toBrazilTime(date));
export const brEndOfDay = (date) => endOfDay(toBrazilTime(date));
export const brStartOfMonth = (date) => startOfMonth(toBrazilTime(date));
export const brEndOfMonth = (date) => endOfMonth(toBrazilTime(date));
export const brStartOfYear = (date) => startOfYear(toBrazilTime(date));
export const brEndOfYear = (date) => endOfYear(toBrazilTime(date));

export const buscarPedidos = async ({ pagamento, tipoVenda, periodo, data, dataInicio, dataFim }) => {
  const where = {};

  if (pagamento) where.forma_pagamento = pagamento;
  if (tipoVenda) where.tipo_venda = tipoVenda;

  if (data) {
    const d = new Date(data);
    where.data_hora_pedido = { gte: brStartOfDay(d), lte: brEndOfDay(d) };
  }

  if (dataInicio && dataFim) {
    const ini = new Date(dataInicio);
    const fim = new Date(dataFim);
    where.data_hora_pedido = { gte: brStartOfDay(ini), lte: brEndOfDay(fim) };
  }

  if (periodo && !data && !dataInicio) {
    const agora = new Date();
    if (periodo === "dia") where.data_hora_pedido = { gte: brStartOfDay(agora), lte: brEndOfDay(agora) };
    if (periodo === "mes") where.data_hora_pedido = { gte: brStartOfMonth(agora), lte: brEndOfMonth(agora) };
    if (periodo === "ano") where.data_hora_pedido = { gte: brStartOfYear(agora), lte: brEndOfYear(agora) };
  }

  const pedidos = await prisma.pedidos.findMany({
    where,
    include: {
      itens: { include: { prato: true, produto: true, variacao: true } }
    }
  });

  return pedidos;
};

export const calcularResumoETop10 = (pedidos) => {
  const totalBruto = pedidos.reduce((acc, p) => {
    const totalItens = p.itens.reduce((t, i) => t + Number(i.preco_unitario) * Number(i.quantidade), 0);
    return acc + totalItens;
  }, 0);

  const totalDescontos = pedidos.reduce((acc, p) => acc + Number(p.desconto || 0), 0);
  const totalLiquido = pedidos.reduce((acc, p) => acc + Number(p.total_liquido), 0);
  const quantidadeVendas = pedidos.length;
  const ticketMedio = quantidadeVendas > 0 ? totalLiquido / quantidadeVendas : 0;

  const contagem = {};
  pedidos.forEach(p => {
    p.itens.forEach(i => {
      const nome = i.prato?.nome_prato || i.produto?.nome_produto || i.variacao?.nome_menu || "Produto Desconhecido";
      contagem[nome] = (contagem[nome] || 0) + Number(i.quantidade);
    });
  });

  const top10 = Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([produto, quantidade]) => ({ produto, quantidade }));

  return { totalBruto, totalDescontos, totalLiquido, quantidadeVendas, ticketMedio, top10 };
};
