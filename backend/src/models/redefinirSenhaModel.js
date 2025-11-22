import prisma from "../prismaCliente.js";
import bcrypt from "bcryptjs";

export const buscarRegistroPorToken = async (token) => {
  return await prisma.resetToken.findFirst({
    where: { token },
  });
};

export const tokenExpirado = (registro) => {
  return new Date() > new Date(registro.expiracao);
};

export const atualizarSenhaUsuario = async (id_usuario, novaSenha) => {
  const senhaHash = await bcrypt.hash(novaSenha, 10);

  await prisma.usuarios.update({
    where: { id_usuario },
    data: { senha_hash: senhaHash },
  });
};

export const limparTokensUsuario = async (id_usuario, idResetToken) => {
  await prisma.resetToken.delete({
    where: { id: idResetToken },
  });

  await prisma.passwordReset.deleteMany({
    where: { id_usuario },
  });
};
