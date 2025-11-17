import prisma from "../src/prismaCliente.js";

async function main() {
    console.log("=== INICIANDO TESTE DE CRIAÇÃO DE MARMITA ===");

    const numeroMarmita = "M001";

    const marmita = await prisma.Marmitas.create({
        data: {
            numero_marmita: numeroMarmita,
            status: "Em_espera",
        }
    });

    console.log("marmita criada com sucesso");
    console.log(`ID: ${marmita.id_marmita}`);
    console.log(`Número: ${marmita.numero_marmita}`);
    console.log(`Status: ${marmita.status}`);
}

main()
    .then(() => {
        console.log("\n=== TESTE DE MARMITA FINALIZADO ===");
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
