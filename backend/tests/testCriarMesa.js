import prisma from "../src/prismaCliente.js";

async function main() {
    console.log("=== INICIANDO TESTE DE CRIAÇAO DE MESAS ===");

    const numeroMesa = "Mesa 10";

    const mesa = await prisma.Mesas.create({
        data: {
            numero_mesa: numeroMesa,
            status: "Fechada",
            capacidade: 4
        }
    });

    console.log("mesa criada com sucesso");
    console.log(`ID: ${mesa.id_mesa}`);
    console.log(`Número: ${mesa.numero_mesa}`);
    console.log(`Status: ${mesa.status}`);
    console.log(`Capacidade: ${mesa.capacidade}`);
}

main()
    .then(() => {
        console.log("\n=== TESTE DE MESAS FINALIZADO ===");
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
