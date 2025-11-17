import prisma from "../src/prismaCliente.js";
import bcrypt from "bcryptjs";

async function main() {
    console.log("=== INICIANDO TESTE DE CRIAÇÃO DE USUARIO ===");

    const senha = "123456";
    const senhaHash = await bcrypt.hash(senha, 10);

    const usuarioTeste = {
        nome_completo: "Usuario Teste",
        email: "teste@example.com",
        usuario: "testeuser",
        senha_hash: senhaHash,
        cargo: "Desenvolvedor",
        nivel_acesso: "Funcionario_Comum",
        status: "Ativo"
    };

    const usuarioCriado = await prisma.Usuarios.create({
        data: usuarioTeste
    });

    console.log("usuario criado com sucesso");
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

    if (usuarioBanco) {
        console.log("usuario confirmado no banco de dados.");
    } else {
        console.log("usuario nao encontrado no banco.");
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
