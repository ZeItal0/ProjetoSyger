import jwt from "jsonwebtoken";
import prisma from "../prismaCliente.js";

export async function autenticarToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ mensagem: "token nao foi fornecido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;

    const usuarioDB = await prisma.Usuarios.findUnique({
      where: { id_usuario: decoded.id },
      select: { status: true, nome_completo: true },
    });

    if (!usuarioDB) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    if (usuarioDB.status === "Suspenso" || usuarioDB.status === "Inativo") {
      return res.status(403).json({
        mensagem: `Usuário ${usuarioDB.nome_completo} está com acesso bloqueado (${usuarioDB.status}).`,
      });
    }

    next();
  } catch (error) {
    console.error("Erro no middleware de autenticação:", error);
    return res.status(403).json({ mensagem: "Token inválido ou fora de validade" });
  }
}

export function autorizar(...rolesPermitidos) {
  return (req, res, next) => {
    const { nivel_acesso } = req.usuario;

    if (!rolesPermitidos.includes(nivel_acesso)) {
      return res.status(403).json({ mensagem: "Acesso negado" });
    }

    next();
  };
}
