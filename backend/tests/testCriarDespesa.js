
import prisma from "../src/prismaCliente.js";

async function main() {
    console.log("=== INICIANDO TESTE DE CRIACAO DE DESPESA ===");

    const idFornecedor = 1;
    const idCategoria = 1;
    const idUsuario = 1;

    try {
        const novaDespesa = await prisma.despesas.create({
            data: {
                descricao: "compra de material de limpeza",
                id_fornecedor: idFornecedor,
                valor_original: 250.00,
                id_categoria_financeira: idCategoria,
                data_vencimento: new Date("2025-11-30"),
                status_divida: "A_pagar",
                id_usuario_registro: idUsuario,
            },
        });

        console.log("despesa criada com sucesso");
        console.log(novaDespesa);
    } catch (err) {
        console.error("erro ao criar despesa:", err);
    }
}

main()
    .then(() => {
        console.log("\n=== TESTE DE DESPESA FINALIZADO ===");
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
