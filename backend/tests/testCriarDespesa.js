import prisma from "../src/prismaCliente.js";

describe("Teste de criação de despesa", () => {
  test("Criar nova despesa", async () => {
    console.log("=== INICIANDO TESTE DE CRIACAO DE DESPESA ===");

    const idFornecedor = 1;
    const idCategoria = 1;
    const idUsuario = 1;

    const novaDespesa = await prisma.despesas.create({
      data: {
        descricao: "compra de material de limpeza",
        id_fornecedor: idFornecedor,
        valor_original: 250.00,
        id_categoria_financeira: idCategoria,
        data_vencimento: new Date("2025-11-30"),
        status_divida: "A_pagar",
        id_usuario_registro: idUsuario,
      }
    });

    console.log("Despesa criada com sucesso");
    console.log(novaDespesa);

    console.log("=== TESTE DE DESPESA FINALIZADO ===");

    expect(novaDespesa).toHaveProperty("id_despesa");
  });
});
