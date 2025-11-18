import prisma from "../prismaCliente.js";
import { startOfDay, endOfDay } from "date-fns";

const toBrazilTime = (date) => new Date(date.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));

const brStartOfDay = (date) => startOfDay(toBrazilTime(date));
const brEndOfDay = (date) => endOfDay(toBrazilTime(date));

export const buscarVendasParaPDF = async ({ forma_pagamento, tipo_venda, data, dataInicial, dataFinal }) => {
  const filtros = {};

  if (forma_pagamento) filtros.forma_pagamento = forma_pagamento;
  if (tipo_venda) filtros.tipo_venda = tipo_venda;

  if (data) {
    const inicio = new Date(data);
    const fim = new Date(data);
    filtros.data_hora_pedido = { gte: brStartOfDay(inicio), lte: brEndOfDay(fim) };
  }

  if (dataInicial && dataFinal) {
    const inicio = new Date(dataInicial);
    const fim = new Date(dataFinal);
    filtros.data_hora_pedido = { gte: brStartOfDay(inicio), lte: brEndOfDay(fim) };
  }

  const vendas = await prisma.pedidos.findMany({
    where: filtros,
    include: {
      itens: {
        include: {
          prato: true,
          produto: true,
          variacao: true
        }
      }
    }
  });
  const totalBruto = vendas.reduce((acc, v) => acc + Number(v.subtotal), 0);
  const totalLiquido = vendas.reduce((acc, v) => acc + Number(v.total_liquido), 0);
  const descontos = vendas.reduce((acc, v) => acc + Number(v.desconto || 0), 0);
  const quantidade = vendas.length;
  const ticketMedio = quantidade > 0 ? totalLiquido / quantidade : 0;

  return { vendas, totalBruto, totalLiquido, descontos, quantidade, ticketMedio };
};
