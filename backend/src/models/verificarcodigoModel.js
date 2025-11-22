import prisma from "../prismaCliente.js";
import crypto from "crypto";

export const verificarCodigo = async (email, codigoDigitado) => {
    const usuario = await prisma.usuarios.findFirst({
        where: { email }
    });

    if (!usuario) return false;

    const registro = await prisma.passwordReset.findFirst({
        where: { id_usuario: usuario.id_usuario, usado: false },
        orderBy: { criado_em: "desc" }
    });

    if (!registro) return false;

    if (registro.tentativas >= 5) {
        return { status: "bloqueado" };
    }

    const hashDigitado = crypto
        .createHash("sha256")
        .update(String(codigoDigitado))
        .digest("hex");

    if (registro.codigo_hash !== hashDigitado) {
        await prisma.passwordReset.update({
            where: { id: registro.id },
            data: { tentativas: registro.tentativas + 1 }
        });

        return false;
    }

    if (new Date() > new Date(registro.expiracao)) return false;

    await prisma.passwordReset.update({
        where: { id: registro.id },
        data: { usado: true, tentativas: 0 }
    });

    return { status: "ok", usuario };
};