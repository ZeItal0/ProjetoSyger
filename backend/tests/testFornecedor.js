import prisma from "../src/prismaCliente.js";

describe("Teste de criação de Fornecedor", () => {
  test("Criar fornecedor de teste", async () => {
    console.log("=== INICIANDO TESTE DE CRIAÇÃO DE FORNECEDOR ===");

    const fornecedorTeste = {
      nome_empresa: "Fornecedor Teste LTDA",
      cnpj: "14345678542191",
      nome_contato: "J da Silva",
      email: "contato@fornecedorteste.com",
      telefone: "11499599999",
      inscricao_estadual: "123416389",
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

    console.log("Fornecedor criado com sucesso!");
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
      console.log("Fornecedor confirmado no banco de dados.");
    } else {
      console.log("Fornecedor não encontrado no banco.");
    }

    expect(fornecedorBanco).not.toBeNull();
    expect(fornecedorBanco.nome_empresa).toBe(fornecedorTeste.nome_empresa);

    console.log("=== TESTE DE FORNECEDOR FINALIZADO ===");
  });
});
