import prisma from "../src/prismaCliente.js";

describe("Teste de listagem de mensagens internas", () => {
  test("Listar mensagens internas", async () => {
    console.log("=== INICIANDO TESTE DE LISTAGEM DE MENSAGENS INTERNAS ===");

    const mensagens = await prisma.mensagensInternas.findMany({
      include: {
        remetente: true,
        destinatario: true,
      },
      orderBy: {
        data_envio: "desc",
      },
      take:10,
    });

    console.log(`Total de mensagens: ${mensagens.length}\n`);

    mensagens.forEach((msg) => {
      console.log(`ID: ${msg.id_mensagem}`);
      console.log(`Assunto: ${msg.assunto ?? "(sem assunto)"}`);
      console.log(`Conteúdo: ${msg.conteudo}`);
      console.log(`De: ${msg.remetente?.nome_completo ?? "Desconhecido"}`);
      console.log(`Para: ${msg.destinatario?.nome_completo ?? "Todos"}`);
      console.log(`Data: ${msg.data_envio}`);
      console.log(`Lida: ${msg.lida ? "sim" : "nao"}`);
      console.log("---------------------------------------------------");
    });

    expect(Array.isArray(mensagens)).toBe(true);

    console.log("=== TESTE DE LISTAGEM DE MENSAGENS FINALIZADO ===");
  });
});
