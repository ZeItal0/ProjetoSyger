import { buscarRegistroPorToken, tokenExpirado, atualizarSenhaUsuario, limparTokensUsuario, } from "../models/redefinirSenhaModel.js";

export const redefinirSenha = async (req, res) => {
  try {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
      return res.status(400).json({ message: "Token e nova senha são obrigatórios." });
    }

    const registro = await buscarRegistroPorToken(token);

    if (!registro) {
      return res.status(400).json({ message: "Token inválido." });
    }

    if (tokenExpirado(registro)) {
      return res.status(400).json({ message: "Token expirado, gere outro código." });
    }

    await atualizarSenhaUsuario(registro.id_usuario, novaSenha);

    await limparTokensUsuario(registro.id_usuario, registro.id);

    return res.json({
      success: true,
      message: "Senha redefinida com sucesso!",
    });

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ message: "Erro ao redefinir senha." });
  }
};
