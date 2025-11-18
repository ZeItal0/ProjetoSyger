import prisma from "../src/prismaCliente.js";

describe("Teste de criação de categoria de prato", () => {
  test("Criar categoria 'Doces'", async () => {
    console.log("=== INICIANDO TESTE DE CRIACAO DE CATEGORIA DE PRATO ===");

    const nomeCategoria = "Doces";

    const categoria = await prisma.CategoriasPrato.create({
      data: { nome_categoria: nomeCategoria }
    });

    console.log("Categoria de prato criada com sucesso");
    console.log(`ID: ${categoria.id_categoria_prato}`);
    console.log(`Nome: ${categoria.nome_categoria}`);

    console.log("=== TESTE DE CATEGORIA DE PRATO FINALIZADO ===");

    expect(categoria).toHaveProperty("id_categoria_prato");
    expect(categoria.nome_categoria).toBe(nomeCategoria);
  });
});
