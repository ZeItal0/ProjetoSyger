import prisma from "../src/prismaCliente.js";

describe("Teste de criação de produto", () => {
  test("Criar produto Arroz Teste", async () => {
    console.log("=== INICIANDO TESTE DE CRIAÇÃO DE PRODUTO ===");

    let categoria = await prisma.CategoriasProduto.findUnique({
      where: { nome_categoria: "insumo Teste" }
    });

    if (!categoria) {
      categoria = await prisma.CategoriasProduto.create({
        data: { nome_categoria: "insumo Teste" }
      });
      console.log("Categoria criada:", categoria.nome_categoria);
    }

    let unidade = await prisma.UnidadesMedida.findUnique({
      where: { nome_unidade: "Kg" }
    });

    if (!unidade) {
      unidade = await prisma.UnidadesMedida.create({
        data: { nome_unidade: "Kg" }
      });
      console.log("Unidade de medida criada:", unidade.nome_unidade);
    }

    const produtoTeste = {
      nome_produto: "Arroz Teste",
      id_categoria_produto: categoria.id_categoria_produto,
      id_unidade_medida: unidade.id_unidade_medida,
      quantidade_real: 10000,
      quantidade_atual: 10,
      peso_por_unidade: 1000,
      quantidade_minima: 5,
      quantidade_maxima: 200,
      custo_unitario: 10.5,
      ativo: true
    };

    const produtoCriado = await prisma.Produtos.create({
      data: produtoTeste
    });

    console.log("Produto criado com sucesso!");
    console.log({
      id_produto: produtoCriado.id_produto,
      nome_produto: produtoCriado.nome_produto,
      categoria: categoria.nome_categoria,
      unidade: unidade.nome_unidade,
      quantidade_real: produtoCriado.quantidade_real
    });

    const produtoBanco = await prisma.Produtos.findUnique({
      where: { id_produto: produtoCriado.id_produto }
    });

    expect(produtoBanco).not.toBeNull();
    expect(produtoBanco.nome_produto).toBe(produtoTeste.nome_produto);

    console.log("Produto confirmado no banco de dados.");
    console.log("=== TESTE DE PRODUTO FINALIZADO ===");
  });
});
