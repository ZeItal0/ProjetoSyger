import nodemailer from "nodemailer";
import prisma from "../prismaCliente.js";
import * as relatorioEmailModel from "../models/relatorioVendasEmailmodel.js";

export const enviarPdfEmail = async (req, res) => {
  try {
    const { forma_pagamento, tipo_venda, data, dataInicial, dataFinal } = req.body;
    const idUsuario = req.usuario.id;

    const usuario = await prisma.usuarios.findUnique({ where: { id_usuario: idUsuario } });
    if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

    const emailDestinatario = usuario.email;

    const { vendas, totalBruto, totalLiquido, descontos, quantidade, ticketMedio } =
      await relatorioEmailModel.buscarVendasParaEmail({ forma_pagamento, tipo_venda, data, dataInicial, dataFinal });

    const pdfBuffer = await relatorioEmailModel.gerarPDFRelatorio({
      vendas,
      totalBruto,
      totalLiquido,
      descontos,
      quantidade,
      ticketMedio,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Sistema de Vendas" <${process.env.GMAIL_USER}>`,
      to: emailDestinatario,
      subject: "Relatório de Vendas",
      text: "Segue em anexo o relatório de vendas solicitado.",
      attachments: [{ filename: "relatorio.pdf", content: pdfBuffer, contentType: "application/pdf" }],
    });

    res.json({ sucesso: true, mensagem: "E-mail enviado com sucesso!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao enviar PDF por e-mail" });
  }
};
