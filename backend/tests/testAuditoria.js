import prisma from "../src/prismaCliente.js";

async function main() {
    console.log("=== INICIANDO TESTE DE LISTAGEM DE HISTORICO DE AUDITORIA ===");

    const historicos = await prisma.Historico_Auditoria.findMany({
        include: {
            usuario: true
        },
        orderBy: {
            data_hora: "desc"
        },
        take: 20
    });

    if (historicos.length === 0) {
        console.log("nenhum registro encontrado no historico.");
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
}

main()
    .then(() => {
        console.log("\n=== TESTE DE HISTÓRICO FINALIZADO ===");
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
