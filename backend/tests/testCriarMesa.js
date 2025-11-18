import prisma from "../src/prismaCliente.js";

describe("Teste de criação de Mesas", () => {
  test("Criar Mesa 10", async () => {
    console.log("=== INICIANDO TESTE DE CRIAÇÃO DE MESAS ===");

    const numeroMesa = "Mesa 10";

    const mesa = await prisma.Mesas.create({
      data: {
        numero_mesa: numeroMesa,
        status: "Fechada",
        capacidade: 4
      }
    });

    console.log("Mesa criada com sucesso");
    console.log(`ID: ${mesa.id_mesa}`);
    console.log(`Número: ${mesa.numero_mesa}`);
    console.log(`Status: ${mesa.status}`);
    console.log(`Capacidade: ${mesa.capacidade}`);

    expect(mesa).toHaveProperty("id_mesa");
    expect(mesa.numero_mesa).toBe(numeroMesa);
    expect(mesa.status).toBe("Fechada");
    expect(mesa.capacidade).toBe(4);

    console.log("=== TESTE DE MESAS FINALIZADO ===");
  });
});
