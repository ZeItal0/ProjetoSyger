import { gerarCodigoParaUsuario, enviarCodigoEmail, buscarUsuarioPorEmail } from "../models/gerarCodigoParaUsuarioModel.js";

export const gerarCodigoRecuperacao = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ erro: "Email é obrigatório!" });

    const usuario = await buscarUsuarioPorEmail(email);

    if (!usuario)
      return res.status(404).json({ erro: "Email não encontrado!" });

    const codigo = await gerarCodigoParaUsuario(usuario);

    await enviarCodigoEmail(email, codigo);

    return res.json({ sucesso: true, mensagem: "Código enviado para o email!" });

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro ao gerar e enviar o código." });
  }
};
