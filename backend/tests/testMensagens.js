import prisma from "../src/prismaCliente.js";

async function main() {
    console.log("=== INICIANDO TESTE DE LISTAGEM DE MENSAGENS INTERNAS ===");

    try {
        const mensagens = await prisma.mensagensInternas.findMany({
            include: {
                remetente: true,
                destinatario: true,
            },
            orderBy: {
                data_envio: "desc",
            },
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
    } catch (err) {
        console.error("erro ao listar mensagens internas:", err);
    }
}

main()
    .then(() => {
        console.log("\n=== TESTE DE LISTAGEM DE MENSAGENS FINALIZADO ===");
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
