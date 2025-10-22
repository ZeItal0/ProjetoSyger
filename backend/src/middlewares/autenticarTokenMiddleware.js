import jwt from "jsonwebtoken";

export function autenticarToken(req, res, next) {
    
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ mensagem: "token foi fornecido ?" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ mensagem: "token fora de validade" });
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

