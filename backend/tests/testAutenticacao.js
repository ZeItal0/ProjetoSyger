import prisma from "../src/prismaCliente.js";
import bcrypt from "bcryptjs";

describe("Teste de autenticação", () => {
  test("Login admin", async () => {
    console.log("=== INICIANDO TESTE DE AUTENTICACAO ===");

    const login = "admin";
    const senhaDigitada = "123456";

    const usuario = await prisma.usuarios.findFirst({
      where: { OR: [{ usuario: login }, { email: login }] }
    });

    if (!usuario) {
      console.log("Usuário não encontrado");
      return;
    }

    const senhaValida = await bcrypt.compare(senhaDigitada, usuario.senha_hash);
    if (!senhaValida) {
      console.log("Senha incorreta");
      return;
    }

    console.log(`Usuário autorizado: Nome: ${usuario.nome_completo}, Nível de acesso: ${usuario.nivel_acesso}`);
    console.log("=== TESTE DE AUTENTICACAO FINALIZADO ===");

    expect(usuario).toBeDefined();
  });
});
