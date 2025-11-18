import prisma from "../src/prismaCliente.js";

describe("Teste de Venda Rápida", () => {
  test("Criar venda rápida e atualizar estoque", async () => {
    console.log("=== INICIANDO TESTE DE VENDA RAPIDA ===");

    const usuario = await prisma.usuarios.findFirst();
    expect(usuario).not.toBeNull();
    if (!usuario) return;

    const variacao = await prisma.variacoesPorcao.findFirst({
      include: {
        prato: {
          include: {
            ingredientes: { include: { produto: true, unidade: true } }
          }
        }
      }
    });
    expect(variacao).not.toBeNull();
    if (!variacao) return;

    const quantidade = 2;
    const preco_unitario = Number(variacao.preco_venda);

    const pedido = await prisma.pedidos.create({
      data: {
        tipo_venda: "Venda_Rapida",
        subtotal: quantidade * preco_unitario,
        total_liquido: quantidade * preco_unitario,
        id_usuario: usuario.id_usuario,
        status_pedido: "Concluido",
        forma_pagamento: "Dinheiro",
      },
    });

    await prisma.pedido_Itens.create({
      data: {
        id_pedido: pedido.id_pedido,
        id_variacao: variacao.id_variacao,
        id_prato: variacao.id_prato,
        quantidade: quantidade,
        preco_unitario: preco_unitario,
      },
    });

    console.log(`Pedido criado! ID: ${pedido.id_pedido}, Total: R$ ${pedido.total_liquido}`);
    expect(pedido.id_pedido).toBeDefined();

    for (const ing of variacao.prato.ingredientes) {
      const pesoPronto = Number(variacao.prato.peso_pronto_total);
      const multiplicador = Number(variacao.multiplicador_receita);
      const pesoConsumido = pesoPronto * multiplicador * quantidade;
      const consumoIngrediente = (Number(ing.valor_medida) / pesoPronto) * pesoConsumido;

      const produtoAtual = await prisma.produtos.findUnique({ where: { id_produto: ing.id_produto } });
      const novaQuantidadeReal = produtoAtual.quantidade_real - consumoIngrediente;

      let novaQuantidadeAtual = produtoAtual.quantidade_atual;
      if (novaQuantidadeReal < produtoAtual.peso_por_unidade * novaQuantidadeAtual) novaQuantidadeAtual -= 1;

      await prisma.produtos.update({
        where: { id_produto: ing.id_produto },
        data: { quantidade_real: novaQuantidadeReal, quantidade_atual: novaQuantidadeAtual },
      });

      await prisma.movimentacaoEstoque.create({
        data: {
          id_produto: ing.id_produto,
          tipo_movimentacao: "Saida",
          quantidade: consumoIngrediente,
          id_unidade_medida: ing.id_unidade_medida,
          observacoes: `Venda rápida de ${variacao.nome_menu}`,
          id_usuario: usuario.id_usuario,
        },
      });
    }

    console.log("Estoque atualizado após venda.");
    console.log("=== TESTE DE VENDA RAPIDA FINALIZADO ===");
  });
});
