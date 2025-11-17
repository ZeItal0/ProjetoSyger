import prisma from "../src/prismaCliente.js";
import bcrypt from "bcryptjs";

async function main() {
    console.log("=== INICIANDO TESTE DE AUTENTICACAO ===");

    const login = "admin";
    const senhaDigitada = "123456";

    const usuario = await prisma.usuarios.findFirst({
        where: {
            OR: [
                { usuario: login },
                { email: login }
            ]
        }
    });

    if (!usuario) {
        console.log("usuario nao encontrado");
        return;
    }

    const senhaValida = await bcrypt.compare(senhaDigitada, usuario.senha_hash);
    if (!senhaValida) {
        console.log("senha incorreta");
        return;
    }

    console.log(`usuario autorizado Nome: ${usuario.nome_completo}, Nivel de acesso: ${usuario.nivel_acesso}`);
}

main()
    .then(() => {
        console.log("\n=== TESTE DE AUTENTICACAO FINALIZADO ===");
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
