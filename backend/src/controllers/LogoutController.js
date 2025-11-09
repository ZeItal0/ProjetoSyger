import { registrarAuditoria } from "../utils/registrarAuditoria.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const LogoutController = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "token não fornecido" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        await registrarAuditoria( decoded.id, "LOGOUT", `Usuário "${decoded.nome_completo}" fez logout do sistema`);

        return res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (error) {
        console.error("erro ao registrar logout:", error);
        return res.status(500).json({ message: "erro ao processar logout" });
    }
};
