import { verificarCodigo } from "../models/verificarcodigoModel.js";
import prisma from "../prismaCliente.js";
import crypto from "crypto";
import { validarCodigoSchema } from "../validations/redefinirSenhaSchema.js";

export const validarCodigo = async (req, res) => {
    try {
        await validarCodigoSchema.validateAsync(req.body, { abortEarly: false });
        const { email, codigo } = req.body;

        if (!email || !codigo)
            return res.status(400).json({ message: "Email e código são obrigatórios." });

        const valido = await verificarCodigo(email, codigo);

        if (valido?.status === "bloqueado") {
            return res.status(403).json({
                message: "Código bloqueado por muitas tentativas. Gere um novo."
            });
        }

        if (valido?.status === "ok") {
            const token = crypto.randomUUID();

            await prisma.resetToken.create({
                data: {
                    id_usuario: valido.usuario.id_usuario,
                    token,
                    expiracao: new Date(Date.now() + 10 * 60 * 1000)
                }
            });

            return res.json({
                success: true,
                message: "Código validado com sucesso!",
                token
            });
        }

        if (!valido)
            return res.status(400).json({ message: "Código inválido ou expirado." });

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ message: "Erro ao validar código." });
    }
};
