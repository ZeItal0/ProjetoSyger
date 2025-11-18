import PDFDocument from "pdfkit";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import * as relatoriopdfModel from "../models/relatorioVendapdfModel.js";

export const relatorioVendasPDF = async (req, res) => {
  try {
    const { forma_pagamento, tipo_venda, periodo, data, dataInicial, dataFinal } = req.query;

    const { vendas, totalBruto, totalLiquido, descontos, quantidade, ticketMedio } =
      await relatoriopdfModel.buscarVendasParaPDF({ forma_pagamento, tipo_venda, data, dataInicial, dataFinal });

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=relatorio.pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Relatório de Vendas", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
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
        .fontSize(14)
        .fillColor("#1f4e78")
        .text(`Venda #${v.id_pedido} — Tipo: ${v.tipo_venda}`, { continued: true })
        .fillColor("black")
        .font("Helvetica")
        .text(`  |  Data: ${format(new Date(v.data_hora_pedido), "dd/MM/yyyy HH:mm", { locale: ptBR })}`);

      doc
        .moveDown(0.3)
        .fillColor("#008000")
        .font("Helvetica-Bold")
        .text(`Total: R$ ${Number(v.total_liquido).toFixed(2)}`);

      doc.moveDown(0.2).fillColor("black").font("Helvetica").text("Itens:");

      v.itens.forEach((item) => {
        const nomeItem =
          item.prato?.nome_prato ||
          item.produto?.nome_produto ||
          item.variacao?.nome_menu ||
          "Item desconhecido";

        doc.text(`  • ${nomeItem} (Qtd: ${item.quantidade}) — R$ ${Number(item.preco_unitario).toFixed(2)}`, {
          indent: 10
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
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao gerar PDF" });
  }
};
