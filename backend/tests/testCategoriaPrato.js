import prisma from "../src/prismaCliente.js";

async function main() {
    console.log("=== INICIANDO TESTE DE CRIACAO DE CATEGORIA DE PRATO ===");

    const nomeCategoria = "Grãos";

    const categoria = await prisma.CategoriasPrato.create({
        data: {
            nome_categoria: nomeCategoria,
        }
    });

    console.log("categoria de prato criada com sucesso");
    console.log(`ID: ${categoria.id_categoria_prato}`);
    console.log(`Nome: ${categoria.nome_categoria}`);
}

main()
    .then(() => {
        console.log("\n=== TESTE DE CATEGORIA DE PRATO FINALIZADO ===");
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
