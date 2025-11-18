import nodemailer from "nodemailer";
import { jest } from "@jest/globals";
import { relatorioVendasPDF } from "../src/controllers/relatorioVendaspdfController.js"; 
import prisma from "../src/prismaCliente.js";

jest.mock("nodemailer");

describe("Teste de envio de PDF por e-mail", () => {
  let sendMailMock;

  beforeAll(() => {
    sendMailMock = jest.fn().mockResolvedValue(true);

    nodemailer.createTransport.mockReturnValue({
      sendMail: sendMailMock
    });
  });

  test("gerar PDF e chamar sendMail", async () => {
    jest.spyOn(prisma.usuarios, "findUnique").mockResolvedValue({
      id_usuario: 1,
      email: "teste@exemplo.com"
    });

    jest.spyOn(prisma.pedidos, "findMany").mockResolvedValue([
      {
        id_pedido: 1,
        tipo_venda: "Venda_Rapida",
        subtotal: 50,
        total_liquido: 50,
        desconto: 0,
        data_hora_pedido: new Date(),
        itens: [
          {
            quantidade: 2,
            preco_unitario: 25,
            prato: { nome_prato: "Prato Teste" },
            produto: null,
            variacao: null
          }
        ]
      }
    ]);

    const req = {
      query: {
        forma_pagamento: "Pix",
        tipo_venda: "Venda_Rapida",
        dataInicial: "2025-01-01",
        dataFinal: "2025-11-18"
      },
      usuario: { id: 1 }
    };

    const res = {
      json: jest.fn(),
      status: jest.fn(() => res)
    };

    await relatorioVendasPDF(req, res);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      sucesso: true,
      mensagem: "Email enviado com sucesso"
    });
  });
});
