import prisma from "../src/prismaCliente.js";

describe("Teste de histórico de auditoria", () => {
  test("Listagem de últimos 20 registros", async () => {
    console.log("=== INICIANDO TESTE DE LISTAGEM DE HISTORICO DE AUDITORIA ===");

    const historicos = await prisma.Historico_Auditoria.findMany({
      include: { usuario: true },
      orderBy: { data_hora: "desc" },
      take: 20,
    });

    if (historicos.length === 0) {
      console.log("Nenhum registro encontrado no histórico.");
    } else {
      console.log(`Foram encontrados ${historicos.length} registros:`);
      historicos.forEach(h => {
        console.log(`
          ID: ${h.id_historico}
          Usuário: ${h.usuario?.nome_completo || "Desconhecido"}
          Ação: ${h.acao}
          Detalhes: ${h.detalhes || "N/A"}
          Data/Hora: ${h.data_hora.toLocaleString()}
        `);
      });
    }

    console.log("=== TESTE DE HISTÓRICO FINALIZADO ===");
    expect(Array.isArray(historicos)).toBe(true);
  });
});
