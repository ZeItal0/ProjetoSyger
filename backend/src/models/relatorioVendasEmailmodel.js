import prisma from "../prismaCliente.js";
import PDFDocument from "pdfkit";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export const buscarVendasParaEmail = async ({ forma_pagamento, tipo_venda, data, dataInicial, dataFinal }) => {
  const filtros = {};

  if (forma_pagamento) filtros.forma_pagamento = forma_pagamento;
  if (tipo_venda) filtros.tipo_venda = tipo_venda;

  if (data) {
    const inicio = new Date(data);
    const fim = new Date(data);
    inicio.setHours(0, 0, 0, 0);
    fim.setHours(23, 59, 59, 999);
    filtros.data_hora_pedido = { gte: inicio, lte: fim };
  }

  if (dataInicial && dataFinal) {
    const inicio = new Date(dataInicial);
    const fim = new Date(dataFinal);
    inicio.setHours(0, 0, 0, 0);
    fim.setHours(23, 59, 59, 999);
    filtros.data_hora_pedido = { gte: inicio, lte: fim };
  }

  const vendas = await prisma.pedidos.findMany({
    where: filtros,
    include: {
      itens: {
        include: { prato: true, produto: true, variacao: true },
      },
    },
  });

  const totalBruto = vendas.reduce((acc, v) => acc + Number(v.subtotal), 0);
  const totalLiquido = vendas.reduce((acc, v) => acc + Number(v.total_liquido), 0);
  const descontos = vendas.reduce((acc, v) => acc + Number(v.desconto || 0), 0);
  const quantidade = vendas.length;
  const ticketMedio = quantidade > 0 ? totalLiquido / quantidade : 0;

  return { vendas, totalBruto, totalLiquido, descontos, quantidade, ticketMedio };
};

export const gerarPDFRelatorio = async ({ vendas, totalBruto, totalLiquido, descontos, quantidade, ticketMedio }) => {
  const doc = new PDFDocument({ margin: 40 });
  let buffers = [];
  doc.on("data", buffers.push.bind(buffers));

  doc.fontSize(20).fillColor("#1f4e78").text("Relatório de Vendas", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).fillColor("black");
  doc.text(`Total Bruto: R$ ${totalBruto.toFixed(2)}`);
  doc.text(`Total Líquido: R$ ${totalLiquido.toFixed(2)}`);
  doc.text(`Descontos: R$ ${descontos.toFixed(2)}`);
  doc.text(`Quantidade de vendas: ${quantidade}`);
  doc.text(`Ticket Médio: R$ ${ticketMedio.toFixed(2)}`);

  doc.moveDown().text("Detalhamento das vendas:", { underline: true });

  vendas.forEach((v) => {
    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .fillColor("#1f4e78")
      .text(`Venda #${v.id_pedido} — Tipo: ${v.tipo_venda}`, { continued: true })
      .fillColor("black")
      .font("Helvetica")
      .text(` | Data: ${format(new Date(v.data_hora_pedido), "dd/MM/yyyy HH:mm", { locale: ptBR })}`);

    doc.moveDown(0.3).fillColor("#008000").font("Helvetica-Bold").text(`Total: R$ ${Number(v.total_liquido).toFixed(2)}`);

    doc.moveDown(0.2).fillColor("black").font("Helvetica").text("Itens:");

    v.itens.forEach((item) => {
      const nomeItem =
        item.prato?.nome_prato || item.produto?.nome_produto || item.variacao?.nome_menu || "Item desconhecido";

      doc.text(`  • ${nomeItem} (Qtd: ${item.quantidade}) — R$ ${Number(item.preco_unitario).toFixed(2)}`, {
        indent: 10,
      });
    });

    doc.moveDown(0.5)
      .strokeColor("#aaaaaa")
      .lineWidth(0.5)
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke();
  });

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
  });
};
