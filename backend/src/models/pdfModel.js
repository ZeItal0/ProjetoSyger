import PDFDocument from "pdfkit";
import prisma from "../prismaCliente.js";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export const gerarInventarioPDFModel = async (res) => {
    const produtos = await prisma.produtos.findMany({
        include: { categoria: true, unidade: true },
        orderBy: { nome_produto: "asc" }
    });

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=inventario.pdf");
    doc.pipe(res);

    doc.fontSize(20).text("Inventário Completo de Estoque", { align: "center" });
    doc.moveDown();
    doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}`);

    produtos.forEach((p) => {
        doc.moveDown();
        doc.font("Helvetica-Bold").fontSize(14).fillColor("#1f4e78").text(p.nome_produto);
        doc.font("Helvetica").fillColor("black").fontSize(12);

        doc.text(`Categoria: ${p.categoria?.nome_categoria}`);
        doc.text(`Quantidade Atual: ${p.quantidade_atual}`);
        doc.text(`Quantidade Mínima: ${p.quantidade_minima}`);
        doc.text(`Unidade: ${p.unidade?.nome_unidade}`);
        doc.text(`Custo Unitário: R$ ${Number(p.custo_unitario).toFixed(2)}`);

        const validade = p.validade
            ? format(new Date(p.validade), "dd/MM/yyyy", { locale: ptBR })
            : "Sem validade";

        doc.text(`Validade: ${validade}`);

        doc.moveDown(0.3)
            .strokeColor("#cccccc")
            .lineWidth(0.5)
            .moveTo(doc.page.margins.left, doc.y)
            .lineTo(doc.page.width - doc.page.margins.right, doc.y)
            .stroke();
    });

    doc.end();
};


export const gerarReposicaoPDFModel = async (res) => {
    const produtos = await prisma.produtos.findMany({
        where: { quantidade_atual: { lt: prisma.produtos.fields.quantidade_minima } },
        orderBy: { quantidade_atual: "asc" }
    });

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=reposicao.pdf");
    doc.pipe(res);

    doc.fontSize(20).text("Relatório de Reposição de Estoque", { align: "center" });
    doc.moveDown();

    if (produtos.length === 0) {
        doc.fontSize(14).fillColor("green").text("Nenhum produto necessita reposição.");
        return doc.end();
    }

    produtos.forEach((p) => {
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold").fontSize(14).fillColor("#1f4e78").text(p.nome_produto);
        doc.font("Helvetica").fontSize(12).fillColor("black");
        doc.text(`Estoque Atual: ${p.quantidade_atual}`);
        doc.text(`Estoque Mínimo: ${p.quantidade_minima}`);
        doc.text(`Necessário Repor: ${p.quantidade_minima - p.quantidade_atual}`);

        doc.moveDown(0.3)
            .strokeColor("#cccccc")
            .lineWidth(0.5)
            .moveTo(doc.page.margins.left, doc.y)
            .lineTo(doc.page.width - doc.page.margins.right, doc.y)
            .stroke();
    });

    doc.end();
};
