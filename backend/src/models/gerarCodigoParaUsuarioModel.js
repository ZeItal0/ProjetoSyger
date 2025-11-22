import prisma from "../prismaCliente.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const gerarCodigoParaUsuario = async (usuario) => {
  const codigo = Math.floor(100000 + Math.random() * 900000);

  const hash = crypto.createHash("sha256").update(String(codigo)).digest("hex");

  await prisma.passwordReset.deleteMany({
    where: { id_usuario: usuario.id_usuario },
  });

  await prisma.passwordReset.create({
    data: {
      id_usuario: usuario.id_usuario,
      codigo_hash: hash,
      expiracao: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  return codigo;
};

export const enviarCodigoEmail = async (email, codigo) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Syger" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Código de Recuperação de Senha - Syger",
    html: `
      <h2>Recuperação de Senha</h2>
      <p>Seu código de recuperação é:</p>
      <h1 style="font-size: 32px; letter-spacing: 4px;">${codigo}</h1>
      <p>Ele expira em <strong>5 minutos</strong>.</p>
    `,
  });
};

export const buscarUsuarioPorEmail = async (email) => {
  return await prisma.usuarios.findFirst({ where: { email } });
};
