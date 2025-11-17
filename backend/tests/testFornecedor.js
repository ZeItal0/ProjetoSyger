import prisma from "../src/prismaCliente.js";

async function main() {
    console.log("=== INICIANDO TESTE DE CRIACAO DE FORNECEDOR ===");

    const fornecedorTeste = {
        nome_empresa: "Fornecedor Teste LTDA",
        cnpj: "12345678000199",
        nome_contato: "João da Silva",
        email: "contato@fornecedorteste.com",
        telefone: "11999999999",
        inscricao_estadual: "123456789",
        cep: "01001000",
        rua: "Rua de Teste",
        numero: "100",
        bairro: "Centro",
        observacoes: "Fornecedor para testes",
        ativo: true
    };

    const fornecedorCriado = await prisma.Fornecedores.create({
        data: fornecedorTeste
    });

    console.log("fornecedor criado com sucesso!");
    console.log({
        id_fornecedor: fornecedorCriado.id_fornecedor,
        nome_empresa: fornecedorCriado.nome_empresa,
        cnpj: fornecedorCriado.cnpj,
        nome_contato: fornecedorCriado.nome_contato,
        email: fornecedorCriado.email,
        telefone: fornecedorCriado.telefone
    });

    const fornecedorBanco = await prisma.Fornecedores.findUnique({
        where: { id_fornecedor: fornecedorCriado.id_fornecedor }
    });

    if (fornecedorBanco) {
        console.log("fornecedor confirmado no banco de dados.");
    } else {
        console.log("fornecedor nao encontrado no banco.");
    }
}

main()
    .then(() => {
        console.log("\n=== TESTE FINALIZADO ===");
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
