import prisma from "../src/prismaCliente.js";

describe("Teste de criação de Marmita", () => {
  test("Criar Marmita M001", async () => {
    console.log("=== INICIANDO TESTE DE CRIAÇÃO DE MARMITA ===");

    const numeroMarmita = "M001";

    const marmita = await prisma.Marmitas.create({
      data: {
        numero_marmita: numeroMarmita,
        status: "Em_espera",
      }
    });

    console.log("Marmita criada com sucesso");
    console.log(`ID: ${marmita.id_marmita}`);
    console.log(`Número: ${marmita.numero_marmita}`);
    console.log(`Status: ${marmita.status}`);

    expect(marmita).toHaveProperty("id_marmita");
    expect(marmita.numero_marmita).toBe(numeroMarmita);
    expect(marmita.status).toBe("Em_espera");

    console.log("=== TESTE DE MARMITA FINALIZADO ===");
  });
});
