import prisma from "../src/prismaCliente.js";
import bcrypt from "bcryptjs";

describe("Teste de criação de usuário", () => {
  test("Criar usuário de teste", async () => {
    console.log("=== INICIANDO TESTE DE CRIAÇÃO DE USUÁRIO ===");

    const senha = "fdgsagfdf";
    const senhaHash = await bcrypt.hash(senha, 10);

    const usuarioTeste = {
      nome_completo: "Usuario Teste 1",
      email: "teste3@example.com",
      usuario: "testeuserA",
      senha_hash: senhaHash,
      cargo: "Desenvolvedor",
      nivel_acesso: "Funcionario_Comum",
      status: "Ativo"
    };

    const usuarioCriado = await prisma.Usuarios.create({
      data: usuarioTeste
    });

    console.log("Usuário criado com sucesso");
    console.log({
      id_usuario: usuarioCriado.id_usuario,
      nome_completo: usuarioCriado.nome_completo,
      email: usuarioCriado.email,
      usuario: usuarioCriado.usuario,
      cargo: usuarioCriado.cargo,
      nivel_acesso: usuarioCriado.nivel_acesso,
      status: usuarioCriado.status
    });

    const usuarioBanco = await prisma.Usuarios.findUnique({
      where: { id_usuario: usuarioCriado.id_usuario }
    });

    expect(usuarioBanco).not.toBeNull();
    expect(usuarioBanco.usuario).toBe(usuarioTeste.usuario);

    console.log("Usuário confirmado no banco de dados.");
    console.log("=== TESTE DE USUÁRIO FINALIZADO ===");
  });
});
